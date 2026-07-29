import { TextInput, View, Pressable, type TextInputProps } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';

type SearchBarProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  value: string;
  onChangeText: (text: string) => void;
};

export function SearchBar({ value, onChangeText, placeholder = 'Buscar...', ...props }: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center gap-2 rounded-xl bg-light-surface px-3 dark:bg-dark-surface"
      style={{ height: 48 }}
    >
      <Search size={18} color={colors.textSecondary} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        className="flex-1 text-base text-light-text dark:text-dark-text"
        style={{ fontFamily: 'Inter_400Regular' }}
        {...props}
      />
      {value.length > 0 && (
        <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" hitSlop={8} onPress={() => onChangeText('')}>
          <X size={18} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}
