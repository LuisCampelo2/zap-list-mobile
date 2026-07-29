import { Text, View } from 'react-native';
import { Button, Card, Screen } from '../../../src/components/ui';
import { useAppSelector } from '../../../src/store/hooks';
import { useLogout } from '../../../src/features/auth/hooks/useLogout';

export default function ProfileScreen() {
  const user = useAppSelector((s) => s.auth.user);
  const logout = useLogout();

  return (
    <Screen>
      <View className="gap-4 pt-4">
        <Card className="gap-1">
          <Text className="text-lg text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_600SemiBold' }}>
            {user?.name} {user?.lastName}
          </Text>
          <Text className="text-light-text-secondary dark:text-dark-text-secondary">{user?.email}</Text>
        </Card>

        <Button label="Sair da conta" variant="outline" onPress={logout} />
      </View>
    </Screen>
  );
}
