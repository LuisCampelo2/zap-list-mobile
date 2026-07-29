import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Screen } from '../../src/components/ui';
import { FormTextField } from '../../src/components/form/FormTextField';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../src/features/auth/schemas/authSchemas';
import { useResetPasswordMutation } from '../../src/services/api/authApi';

export default function ResetPasswordScreen() {
  const { resetToken } = useLocalSearchParams<{ resetToken: string }>();
  const router = useRouter();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const { control, handleSubmit } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const result = await resetPassword({ resetToken, password: data.password }).unwrap().catch(() => null);
    if (!result) return;
    router.replace('/(auth)/login');
  };

  const apiErrorMessage = error && 'message' in error ? (error as { message: string }).message : null;

  return (
    <Screen scroll>
      <View className="flex-1 justify-center gap-6 py-12">
        <View className="gap-1">
          <Text className="text-3xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
            Nova senha
          </Text>
          <Text className="text-light-text-secondary dark:text-dark-text-secondary">
            Escolha uma senha forte para sua conta
          </Text>
        </View>

        <View className="gap-4">
          <FormTextField control={control} name="password" label="Nova senha" isPassword />
          <FormTextField control={control} name="confirmPassword" label="Confirmar nova senha" isPassword />

          {apiErrorMessage && (
            <Text className="text-center text-sm text-error">{apiErrorMessage}</Text>
          )}

          <Button label="Redefinir senha" onPress={handleSubmit(onSubmit)} loading={isLoading} />
        </View>
      </View>
    </Screen>
  );
}
