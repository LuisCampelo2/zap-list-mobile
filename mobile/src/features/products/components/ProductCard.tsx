import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { config } from '../../../constants/config';
import { formatCurrency, unitLabel } from '../../../utils/currency';
import { useTheme } from '../../../theme/ThemeProvider';
import type { Product } from '../../../types/product';

type ProductCardProps = {
  product: Product;
  onToggleFavorite: (id: number) => void;
  onAddToList: (product: Product) => void;
};

export function ProductCard({ product, onToggleFavorite, onAddToList }: ProductCardProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 gap-2 rounded-2xl bg-light-surface p-3 dark:bg-dark-surface">
      <View className="aspect-square w-full items-center justify-center rounded-xl bg-light-surface-alt dark:bg-dark-surface-alt">
        {product.imageUrl ? (
          <Image
            source={{ uri: `${config.serverOrigin}${product.imageUrl}` }}
            style={{ width: '70%', height: '70%' }}
            contentFit="contain"
            transition={150}
          />
        ) : (
          <Text className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Sem imagem</Text>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={product.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          hitSlop={10}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggleFavorite(product.id);
          }}
          className="absolute right-1 top-1 rounded-full bg-light-surface/90 p-1.5 dark:bg-dark-surface/90"
        >
          <Heart
            size={16}
            color={product.isFavorite ? colors.error : colors.textSecondary}
            fill={product.isFavorite ? colors.error : 'transparent'}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Adicionar ${product.name} a uma lista`}
          hitSlop={10}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onAddToList(product);
          }}
          className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5"
        >
          <Plus size={16} color="#FFFFFF" />
        </Pressable>
      </View>

      <Text
        numberOfLines={2}
        className="text-sm text-light-text dark:text-dark-text"
        style={{ fontFamily: 'Inter_600SemiBold' }}
      >
        {product.name}
      </Text>

      <Text
        className="text-sm text-primary"
        style={{ fontFamily: 'Inter_700Bold' }}
      >
        {formatCurrency(product.price)}
        <Text className="text-xs text-light-text-secondary dark:text-dark-text-secondary"> /{unitLabel(product.unitOfCalculation)}</Text>
      </Text>
    </View>
  );
}
