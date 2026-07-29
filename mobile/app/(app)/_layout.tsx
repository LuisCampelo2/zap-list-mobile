import { Redirect, Stack } from 'expo-router';
import { useAppSelector } from '../../src/store/hooks';

export default function AppLayout() {
  const status = useAppSelector((s) => s.auth.status);

  if (status === 'unauthenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
