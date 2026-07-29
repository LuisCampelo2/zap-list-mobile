import { useMemo, useRef } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { PackageSearch } from 'lucide-react-native';
import { Chip, EmptyState, Screen, SearchBar, Skeleton } from '../../../src/components/ui';
import { ProductCard } from '../../../src/features/products/components/ProductCard';
import { AddToListSheet, type AddToListSheetHandle } from '../../../src/features/lists/components/AddToListSheet';
import { useProductSearch } from '../../../src/features/products/hooks/useProductSearch';
import { useGetProductsQuery, useToggleFavoriteMutation } from '../../../src/services/api/productsApi';

function ProductsSkeletonGrid() {
  return (
    <View className="flex-row flex-wrap gap-3 px-5 pt-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} className="w-[47%] gap-2">
          <Skeleton height={140} radius={16} />
          <Skeleton height={14} width="80%" />
          <Skeleton height={14} width="40%" />
        </View>
      ))}
    </View>
  );
}

export default function ProductsScreen() {
  const { data: products = [], isLoading, isFetching, refetch } = useGetProductsQuery();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const { query, setQuery, category, setCategory, favoritesOnly, setFavoritesOnly, results } =
    useProductSearch(products);
  const addToListSheetRef = useRef<AddToListSheetHandle>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  if (isLoading) {
    return (
      <Screen padded={false}>
        <View className="px-5 pb-2 pt-2">
          <Text className="text-2xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
            Produtos
          </Text>
        </View>
        <ProductsSkeletonGrid />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <View className="gap-3 px-5 pb-3 pt-2">
        <Text className="text-2xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
          Produtos
        </Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar produtos ou categorias" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Chip label="Favoritos" selected={favoritesOnly} onPress={() => setFavoritesOnly((v) => !v)} />
          {categories.map((c) => (
            <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(category === c ? null : c)} />
          ))}
        </ScrollView>
      </View>

      <FlashList
        data={results}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View style={{ flex: 1, paddingHorizontal: 6 }}>
            <ProductCard
              product={item}
              onToggleFavorite={(id) => toggleFavorite(id)}
              onAddToList={(product) => addToListSheetRef.current?.present(product)}
            />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          <EmptyState
            icon={PackageSearch}
            title="Nenhum produto encontrado"
            description="Tente buscar por outro termo ou remover os filtros."
          />
        }
      />

      <AddToListSheet ref={addToListSheetRef} />
    </Screen>
  );
}
