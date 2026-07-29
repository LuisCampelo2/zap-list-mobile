import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Screen } from '../../src/components/ui';
import { FormTextField } from '../../src/components/form/FormTextField';
import { verifyCodeSchema, type VerifyCodeFormData } from '../../src/features/auth/schemas/authSchemas';
import { useVerifyResetCodeMutation } from '../../src/services/api/authApi';

export default function VerifyCodeScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const [verifyResetCode, { isLoading, error }] = useVerifyResetCodeMutation();

  const { control, handleSubmit } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (data: VerifyCodeFormData) => {
    const result = await verifyResetCode({ email, code: data.code }).unwrap().catch(() => null);
    if (!result) return;
    router.push({ pathname: '/(auth)/reset-password', params: { resetToken: result.resetToken } });
  };

  const apiErrorMessage = error && 'message' in error ? (error as { message: string }).message : null;

  return (
    <Screen scroll>
      <View className="flex-1 justify-center gap-6 py-12">
        <View className="gap-1">
          <Text className="text-3xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
            Digite o código
          </Text>
          <Text className="text-light-text-secondary dark:text-dark-text-secondary">
            Enviamos um código de 6 dígitos para {email}
          </Text>
        </View>

        <View className="gap-4">
          <FormTextField
            control={control}
            name="code"
            label="Código"
            keyboardType="number-pad"
            maxLength={6}
          />

          {apiErrorMessage && (
            <Text className="text-center text-sm text-error">{apiErrorMessage}</Text>
          )}

          <Button label="Confirmar" onPress={handleSubmit(onSubmit)} loading={isLoading} />
        </View>
      </View>
    </Screen>
  );
}
