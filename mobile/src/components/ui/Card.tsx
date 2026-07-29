import { View, type ViewProps } from 'react-native';

export function Card({ className = '', ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={`rounded-2xl bg-light-surface p-4 shadow-sm dark:bg-dark-surface ${className}`}
      {...props}
    />
  );
}
