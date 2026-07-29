import { Text, View } from 'react-native';
import { Screen } from '../../../src/components/ui';
import { useAppSelector } from '../../../src/store/hooks';

export default function DashboardScreen() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <Screen>
      <View className="flex-1 justify-center gap-2">
        <Text className="text-2xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
          Olá, {user?.name} 👋
        </Text>
        <Text className="text-light-text-secondary dark:text-dark-text-secondary">
          O dashboard (resumo, economia, insights) chega na próxima fase.
        </Text>
      </View>
    </Screen>
  );
}
