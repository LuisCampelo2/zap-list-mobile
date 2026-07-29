import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Screen } from '../../src/components/ui';
import { FormTextField } from '../../src/components/form/FormTextField';
import { registerSchema, type RegisterFormData } from '../../src/features/auth/schemas/authSchemas';
import { useRegisterMutation } from '../../src/services/api/authApi';

export default function RegisterScreen() {
  const router = useRouter();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerUser(data).unwrap().catch(() => null);
    if (!result) return;
    router.replace('/(auth)/activate');
  };

  const apiErrorMessage = error && 'message' in error ? (error as { message: string }).message : null;

  return (
    <Screen scroll>
      <View className="gap-6 py-12">
        <View className="gap-1">
          <Text className="text-3xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
            Criar conta
          </Text>
          <Text className="text-light-text-secondary dark:text-dark-text-secondary">
            Leva menos de um minuto
          </Text>
        </View>

        <View className="gap-4">
          <FormTextField control={control} name="name" label="Nome" autoComplete="given-name" />
          <FormTextField control={control} name="lastName" label="Sobrenome" autoComplete="family-name" />
          <FormTextField
            control={control}
            name="email"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <FormTextField control={control} name="password" label="Senha" isPassword />
          <FormTextField control={control} name="confirmPassword" label="Confirmar senha" isPassword />

          {apiErrorMessage && (
            <Text className="text-center text-sm text-error">{apiErrorMessage}</Text>
          )}

          <Button label="Criar conta" onPress={handleSubmit(onSubmit)} loading={isLoading} />
        </View>

        <View className="flex-row justify-center gap-1">
          <Text className="text-light-text-secondary dark:text-dark-text-secondary">Já tem conta?</Text>
          <Text
            className="text-primary"
            style={{ fontFamily: 'Inter_600SemiBold' }}
            onPress={() => router.back()}
          >
            Entrar
          </Text>
        </View>
      </View>
    </Screen>
  );
}
