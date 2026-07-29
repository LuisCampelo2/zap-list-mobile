import { useState } from 'react';
import { Text, TextInput, View, Pressable, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
};

/**
 * Alvo de toque e área do input seguem o mínimo de 44x44pt recomendado pelas
 * diretrizes de acessibilidade da Apple/Google (WCAG 2.5.5) — padding
 * vertical generoso em vez de um input compacto.
 */
export function TextField({
  label,
  error,
  helperText,
  isPassword = false,
  ...inputProps
}: TextFieldProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const borderColor = error ? colors.error : isFocused ? colors.primary : colors.border;

  return (
    <View className="gap-1.5">
      <Text
        className="text-sm text-light-text-secondary dark:text-dark-text-secondary"
        style={{ fontFamily: 'Inter_500Medium' }}
      >
        {label}
      </Text>

      <View
        className="flex-row items-center rounded-xl border bg-light-surface px-4 dark:bg-dark-surface"
        style={{ borderColor, minHeight: 52 }}
      >
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={(e) => {
            setIsFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            inputProps.onBlur?.(e);
          }}
          className="flex-1 text-base text-light-text dark:text-dark-text"
          style={{ fontFamily: 'Inter_400Regular' }}
          {...inputProps}
        />

        {isPassword && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={12}
            onPress={() => setIsPasswordVisible((v) => !v)}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={colors.textSecondary} />
            ) : (
              <Eye size={20} color={colors.textSecondary} />
            )}
          </Pressable>
        )}
      </View>

      {(error || helperText) && (
        <Text
          className={error ? 'text-sm text-error' : 'text-sm text-light-text-secondary dark:text-dark-text-secondary'}
        >
          {error ?? helperText}
        </Text>
      )}
    </View>
  );
}
