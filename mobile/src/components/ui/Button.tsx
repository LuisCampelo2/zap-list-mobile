import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 rounded-lg',
  md: 'px-4 py-3.5 rounded-xl',
  lg: 'px-6 py-4 rounded-2xl',
};

const labelSizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

/**
 * Botão base do design system. Feedback tátil (haptics) + leve escala ao
 * pressionar seguem o padrão de apps premium (Nubank/iFood) pedido no
 * briefing — sinaliza toque reconhecido antes mesmo da ação completar.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = true,
  disabled,
  onPressIn,
  onPressOut,
  ...pressableProps
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'bg-transparent border-2 border-primary',
    ghost: 'bg-transparent',
    destructive: 'bg-error',
  };

  const labelColor =
    variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textInverse;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPressIn={(e) => {
        scale.value = withTiming(0.97, { duration: 100 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, { duration: 100 });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        pressableProps.onPress?.(e);
      }}
      className={`items-center justify-center flex-row gap-2 ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : ''}`}
      style={animatedStyle}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <Text
          className={`font-semibold ${labelSizeClasses[size]}`}
          style={{ color: labelColor, fontFamily: 'Inter_600SemiBold' }}
        >
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}
