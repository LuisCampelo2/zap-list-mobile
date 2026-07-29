import { Text, View } from 'react-native';

type BadgeVariant = 'neutral' | 'success' | 'error' | 'warning' | 'info';

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-light-surface-alt dark:bg-dark-surface-alt',
  success: 'bg-success/15',
  error: 'bg-error/15',
  warning: 'bg-warning/15',
  info: 'bg-info/15',
};

const textClasses: Record<BadgeVariant, string> = {
  neutral: 'text-light-text-secondary dark:text-dark-text-secondary',
  success: 'text-success',
  error: 'text-error',
  warning: 'text-warning',
  info: 'text-info',
};

export function Badge({ label, variant = 'neutral' }: { label: string; variant?: BadgeVariant }) {
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${variantClasses[variant]}`}>
      <Text className={`text-xs ${textClasses[variant]}`} style={{ fontFamily: 'Inter_600SemiBold' }}>
        {label}
      </Text>
    </View>
  );
}
