import { Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Screen } from '../../src/components/ui';
import { FormTextField } from '../../src/components/form/FormTextField';
import { loginSchema, type LoginFormData } from '../../src/features/auth/schemas/authSchemas';
import { useLoginMutation } from '../../src/services/api/authApi';
import { secureStorage } from '../../src/services/storage/secureStorage';
import { setCredentials } from '../../src/store/slices/authSlice';
import { useAppDispatch } from '../../src/store/hooks';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data).unwrap().catch(() => null);
    if (!result) return;

    await secureStorage.setRefreshToken(result.refreshToken);
    dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }));
  };

  const apiErrorMessage = error && 'message' in error ? (error as { message: string }).message : null;

  return (
    <Screen scroll>
      <View className="flex-1 justify-center gap-6 py-12">
        <View className="gap-1">
          <Text className="text-3xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
            Bem-vindo de volta
          </Text>
          <Text className="text-light-text-secondary dark:text-dark-text-secondary">
            Entre para continuar suas compras
          </Text>
        </View>

        <View className="gap-4">
          <FormTextField
            control={control}
            name="email"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <FormTextField
            control={control}
            name="password"
            label="Senha"
            isPassword
            autoComplete="password"
          />

          <Link href="/(auth)/forgot-password" asChild>
            <Text className="self-end text-sm text-primary" style={{ fontFamily: 'Inter_500Medium' }}>
              Esqueci minha senha
            </Text>
          </Link>

          {apiErrorMessage && (
            <Text className="text-center text-sm text-error">{apiErrorMessage}</Text>
          )}

          <Button label="Entrar" onPress={handleSubmit(onSubmit)} loading={isLoading} />
        </View>

        <View className="flex-row justify-center gap-1">
          <Text className="text-light-text-secondary dark:text-dark-text-secondary">Ainda não tem conta?</Text>
          <Text
            className="text-primary"
            style={{ fontFamily: 'Inter_600SemiBold' }}
            onPress={() => router.push('/(auth)/register')}
          >
            Cadastre-se
          </Text>
        </View>
      </View>
    </Screen>
  );
}
