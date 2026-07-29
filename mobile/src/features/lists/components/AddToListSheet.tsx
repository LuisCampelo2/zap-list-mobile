import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Minus, Plus, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Button } from '../../../components/ui';
import { useTheme } from '../../../theme/ThemeProvider';
import { useGetListsQuery, useCreateListMutation, useAddItemToListMutation } from '../../../services/api/listsApi';
import type { Product } from '../../../types/product';

export type AddToListSheetHandle = {
  present: (product: Product) => void;
};

/**
 * Bottom sheet único, montado uma vez na tela de Produtos: cada ProductCard
 * chama `sheetRef.current?.present(product)` em vez de cada card montar seu
 * próprio modal — mais barato e evita duplicar estado de "lista selecionada"
 * por card.
 */
export const AddToListSheet = forwardRef<AddToListSheetHandle>((_props, ref) => {
  const { colors } = useTheme();
  const modalRef = useRef<BottomSheetModal>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [newListName, setNewListName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: lists = [] } = useGetListsQuery();
  const [createList] = useCreateListMutation();
  const [addItemToList, { isLoading: isAdding }] = useAddItemToListMutation();

  useImperativeHandle(ref, () => ({
    present: (p) => {
      setProduct(p);
      setQuantity(p.unitOfMeasure === 'KG' ? 0.5 : 1);
      setSelectedListId(lists[0]?.id ?? null);
      setNewListName(lists.length === 0 ? 'Minha lista' : '');
      setErrorMessage(null);
      modalRef.current?.present();
    },
  }));

  if (!product) return null;

  const isKg = product.unitOfMeasure === 'KG';
  const step = isKg ? 0.5 : 1;
  const isCreatingNewList = newListName.trim().length > 0;

  const adjustQuantity = (delta: number) => {
    Haptics.selectionAsync();
    setQuantity((q) => Math.max(step, Math.round((q + delta) / step) * step));
  };

  const handleConfirm = async () => {
    setErrorMessage(null);
    try {
      let listId = selectedListId;
      if (isCreatingNewList) {
        const created = await createList({ name: newListName.trim() }).unwrap();
        listId = created.id;
      }
      if (!listId) {
        setErrorMessage('Escolha ou crie uma lista');
        return;
      }

      await addItemToList({ listId, productId: product.id, quantity }).unwrap();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      modalRef.current?.dismiss();
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : 'Não foi possível adicionar o produto';
      setErrorMessage(message);
    }
  };

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
    >
      <BottomSheetView className="gap-4 px-5 pb-8 pt-2">
        <Text className="text-lg text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
          Adicionar {product.name} à lista
        </Text>

        <View className="flex-row items-center justify-center gap-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Diminuir quantidade"
            onPress={() => adjustQuantity(-step)}
            className="h-10 w-10 items-center justify-center rounded-full bg-light-surface-alt dark:bg-dark-surface-alt"
          >
            <Minus size={18} color={colors.textPrimary} />
          </Pressable>
          <Text className="w-16 text-center text-xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_600SemiBold' }}>
            {isKg ? quantity.toFixed(1) : quantity}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Aumentar quantidade"
            onPress={() => adjustQuantity(step)}
            className="h-10 w-10 items-center justify-center rounded-full bg-light-surface-alt dark:bg-dark-surface-alt"
          >
            <Plus size={18} color={colors.textPrimary} />
          </Pressable>
        </View>

        {lists.length > 0 && (
          <View className="gap-2">
            <Text className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Escolha a lista</Text>
            {lists.map((list) => (
              <Pressable
                key={list.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedListId === list.id && !isCreatingNewList }}
                onPress={() => {
                  setSelectedListId(list.id);
                  setNewListName('');
                }}
                className="flex-row items-center justify-between rounded-xl border border-light-border bg-light-surface px-4 py-3 dark:border-dark-border dark:bg-dark-surface"
              >
                <Text className="text-light-text dark:text-dark-text">{list.name}</Text>
                {selectedListId === list.id && !isCreatingNewList && <Check size={18} color={colors.primary} />}
              </Pressable>
            ))}
          </View>
        )}

        <View className="gap-1.5">
          <Text className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {lists.length > 0 ? 'Ou crie uma lista nova' : 'Nome da lista'}
          </Text>
          <TextInput
            value={newListName}
            onChangeText={setNewListName}
            placeholder="Ex: Compras da semana"
            placeholderTextColor={colors.textSecondary}
            className="rounded-xl border border-light-border bg-light-surface px-4 py-3 text-light-text dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
          />
        </View>

        {errorMessage && <Text className="text-center text-sm text-error">{errorMessage}</Text>}

        <Button
          label="Adicionar à lista"
          onPress={handleConfirm}
          loading={isAdding}
          disabled={!isCreatingNewList && !selectedListId}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

AddToListSheet.displayName = 'AddToListSheet';
