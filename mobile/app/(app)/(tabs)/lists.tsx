import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { ListChecks } from 'lucide-react-native';
import { Button, Card, EmptyState, Screen, Skeleton, TextField } from '../../../src/components/ui';
import { formatCurrency } from '../../../src/utils/currency';
import { useCreateListMutation, useGetListsQuery } from '../../../src/services/api/listsApi';

function ListsSkeleton() {
  return (
    <View className="gap-3 px-5 pt-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} height={72} radius={16} />
      ))}
    </View>
  );
}

export default function ListsScreen() {
  const router = useRouter();
  const { data: lists = [], isLoading } = useGetListsQuery();
  const [createList, { isLoading: isCreating }] = useCreateListMutation();
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleCreate = async () => {
    if (!newListName.trim()) return;
    const list = await createList({ name: newListName.trim() }).unwrap().catch(() => null);
    if (!list) return;
    setNewListName('');
    setIsCreatingNew(false);
    router.push({ pathname: '/lists/[id]', params: { id: String(list.id) } });
  };

  if (isLoading) {
    return (
      <Screen padded={false}>
        <View className="px-5 pb-2 pt-2">
          <Text className="text-2xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
            Minhas listas
          </Text>
        </View>
        <ListsSkeleton />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <View className="flex-row items-center justify-between px-5 pb-3 pt-2">
        <Text className="text-2xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
          Minhas listas
        </Text>
        <Button
          label="Nova lista"
          size="sm"
          fullWidth={false}
          onPress={() => setIsCreatingNew((v) => !v)}
        />
      </View>

      {isCreatingNew && (
        <View className="flex-row items-end gap-2 px-5 pb-3">
          <View className="flex-1">
            <TextField
              label="Nome da lista"
              value={newListName}
              onChangeText={setNewListName}
              placeholder="Ex: Compras da semana"
              autoFocus
            />
          </View>
          <View className="pb-1.5">
            <Button label="Criar" fullWidth={false} loading={isCreating} onPress={handleCreate} />
          </View>
        </View>
      )}

      <FlashList
        data={lists}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: '/lists/[id]', params: { id: String(item.id) } })}>
            <Card>
              <View className="flex-row items-center justify-between">
                <View className="gap-1">
                  <Text className="text-base text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    {item.name}
                  </Text>
                  <Text className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {item.itemCount} {item.itemCount === 1 ? 'item' : 'itens'}
                  </Text>
                </View>
                <Text className="text-base text-primary" style={{ fontFamily: 'Inter_700Bold' }}>
                  {formatCurrency(item.totalPrice)}
                </Text>
              </View>
            </Card>
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={ListChecks}
            title="Nenhuma lista ainda"
            description="Crie sua primeira lista ou adicione um produto direto da aba Produtos."
            actionLabel="Criar lista"
            onAction={() => setIsCreatingNew(true)}
          />
        }
      />
    </Screen>
  );
}
