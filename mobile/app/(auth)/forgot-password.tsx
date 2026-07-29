import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Screen } from '../../src/components/ui';
import { FormTextField } from '../../src/components/form/FormTextField';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../src/features/auth/schemas/authSchemas';
import { useForgotPasswordMutation } from '../../src/services/api/authApi';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const { control, handleSubmit, getValues } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPassword(data).unwrap().catch(() => null);
    // Resposta do servidor é sempre a mesma exista ou não a conta (anti-enumeração),
    // então seguimos para a próxima etapa independentemente do resultado.
    router.push({ pathname: '/(auth)/verify-code', params: { email: getValues('email') } });
  };

  return (
    <Screen scroll>
      <View className="flex-1 justify-center gap-6 py-12">
        <View className="gap-1">
          <Text className="text-3xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
            Recuperar senha
          </Text>
          <Text className="text-light-text-secondary dark:text-dark-text-secondary">
            Enviaremos um código de 6 dígitos para o seu email
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
          <Button label="Enviar código" onPress={handleSubmit(onSubmit)} loading={isLoading} />
        </View>
      </View>
    </Screen>
  );
}
