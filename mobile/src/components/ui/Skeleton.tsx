import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  className?: string;
};

/** Placeholder de carregamento com pulso suave — usado no lugar de spinners em listas/cards. */
export function Skeleton({ width = '100%', height = 16, radius = 8, className = '' }: SkeletonProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withSequence(withTiming(1, { duration: 700 }), withTiming(0.5, { duration: 700 })), -1);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className={`bg-light-surface-alt dark:bg-dark-surface-alt ${className}`}
      style={[{ width, height, borderRadius: radius }, style]}
    />
  );
}
