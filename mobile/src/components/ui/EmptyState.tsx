import { Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from './Button';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center gap-3 px-8 py-12">
      <View className="rounded-full bg-light-surface-alt p-4 dark:bg-dark-surface-alt">
        <Icon size={32} color={colors.textSecondary} />
      </View>
      <Text
        className="text-center text-lg text-light-text dark:text-dark-text"
        style={{ fontFamily: 'Inter_600SemiBold' }}
      >
        {title}
      </Text>
      {description && (
        <Text className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <View className="mt-2 w-full max-w-xs">
          <Button label={actionLabel} variant="outline" onPress={onAction} />
        </View>
      )}
    </View>
  );
}
