import { Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

/** Chip de filtro (categorias, tags) — distinto de Badge, que é só um rótulo estático não interativo. */
export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={4}
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
      className={`rounded-full border px-4 py-2 ${
        selected
          ? 'border-primary bg-primary'
          : 'border-light-border bg-light-surface dark:border-dark-border dark:bg-dark-surface'
      }`}
    >
      <Text
        className={selected ? 'text-sm text-white' : 'text-sm text-light-text dark:text-dark-text'}
        style={{ fontFamily: 'Inter_500Medium' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
