import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { ChevronLeft, ShoppingBag, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { EmptyState, Screen, Skeleton } from '../../../src/components/ui';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { config } from '../../../src/constants/config';
import { formatCurrency, unitLabel } from '../../../src/utils/currency';
import {
  useDeleteListItemMutation,
  useGetListItemsQuery,
  useUpdateListItemMutation,
} from '../../../src/services/api/listsApi';
import type { ShoppingListItem } from '../../../src/types/shoppingList';

function ItemRow({ item, listId }: { item: ShoppingListItem; listId: number }) {
  const { colors } = useTheme();
  const [updateItem] = useUpdateListItemMutation();
  const [deleteItem] = useDeleteListItemMutation();

  return (
    <View className="flex-row items-center gap-3 rounded-2xl bg-light-surface p-3 dark:bg-dark-surface">
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.isChecked }}
        onPress={() => {
          Haptics.selectionAsync();
          updateItem({ listId, itemId: item.id, isChecked: !item.isChecked });
        }}
        className="h-6 w-6 items-center justify-center rounded-full border-2"
        style={{ borderColor: item.isChecked ? colors.success : colors.border, backgroundColor: item.isChecked ? colors.success : 'transparent' }}
      />

      <View className="h-12 w-12 items-center justify-center rounded-lg bg-light-surface-alt dark:bg-dark-surface-alt">
        {item.product.imageUrl && (
          <Image
            source={{ uri: `${config.serverOrigin}${item.product.imageUrl}` }}
            style={{ width: '80%', height: '80%' }}
            contentFit="contain"
          />
        )}
      </View>

      <View className="flex-1 gap-0.5">
        <Text
          className={`text-sm ${item.isChecked ? 'text-light-text-secondary line-through dark:text-dark-text-secondary' : 'text-light-text dark:text-dark-text'}`}
          style={{ fontFamily: 'Inter_600SemiBold' }}
        >
          {item.product.name}
        </Text>
        <Text className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
          {item.quantity} {unitLabel(item.product.unitOfMeasure)} · {formatCurrency(item.subtotal)}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remover ${item.product.name} da lista`}
        hitSlop={10}
        onPress={() => deleteItem({ listId, itemId: item.id })}
      >
        <Trash2 size={18} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listId = Number(id);
  const router = useRouter();
  const { colors } = useTheme();
  const { data, isLoading } = useGetListItemsQuery(listId);

  return (
    <Screen padded={false}>
      <View className="flex-row items-center gap-3 px-5 pb-3 pt-2">
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={10} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
            {data?.list.name ?? 'Lista'}
          </Text>
          {data && (
            <Text className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Total: {formatCurrency(data.list.totalPrice)}
            </Text>
          )}
        </View>
      </View>

      {isLoading ? (
        <View className="gap-3 px-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={64} radius={16} />
          ))}
        </View>
      ) : (
        <FlashList
          data={data?.items ?? []}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => <ItemRow item={item} listId={listId} />}
          ListEmptyComponent={
            <EmptyState
              icon={ShoppingBag}
              title="Lista vazia"
              description="Adicione produtos direto da aba Produtos."
            />
          }
        />
      )}
    </Screen>
  );
}
