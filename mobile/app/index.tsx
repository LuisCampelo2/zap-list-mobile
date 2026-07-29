import { Redirect } from 'expo-router';
import { useAppSelector } from '../src/store/hooks';

export default function Index() {
  const status = useAppSelector((s) => s.auth.status);
  return <Redirect href={status === 'authenticated' ? '/(app)/(tabs)' : '/(auth)/login'} />;
}
