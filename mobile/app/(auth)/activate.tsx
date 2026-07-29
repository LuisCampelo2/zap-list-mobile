import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, MailCheck, XCircle } from 'lucide-react-native';
import { Button, Screen } from '../../src/components/ui';
import { useActivateMutation } from '../../src/services/api/authApi';
import { useTheme } from '../../src/theme/ThemeProvider';

type Status = 'waiting' | 'activating' | 'success' | 'error';

/**
 * Alcançada de duas formas: (1) navegação interna após o cadastro, sem
 * `token` — apenas instrui a checar o email; (2) deep link `zaplist://activate?token=...`
 * aberto a partir do email de ativação — nesse caso ativa automaticamente.
 */
export default function ActivateScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [activate] = useActivateMutation();
  const [status, setStatus] = useState<Status>(token ? 'activating' : 'waiting');

  useEffect(() => {
    if (!token) return;
    activate({ token })
      .unwrap()
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token, activate]);

  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-4 px-6">
        {status === 'waiting' && (
          <>
            <MailCheck size={48} color={colors.primary} />
            <Text className="text-center text-xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
              Verifique seu email
            </Text>
            <Text className="text-center text-light-text-secondary dark:text-dark-text-secondary">
              Enviamos um link de ativação. Toque nele pelo celular para começar a usar o Zap List.
            </Text>
          </>
        )}

        {status === 'activating' && (
          <Text className="text-light-text-secondary dark:text-dark-text-secondary">Ativando sua conta…</Text>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 size={48} color={colors.success} />
            <Text className="text-center text-xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
              Conta ativada!
            </Text>
            <Button label="Ir para o login" onPress={() => router.replace('/(auth)/login')} />
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} color={colors.error} />
            <Text className="text-center text-xl text-light-text dark:text-dark-text" style={{ fontFamily: 'Inter_700Bold' }}>
              Link inválido ou expirado
            </Text>
            <Button label="Voltar para o login" variant="outline" onPress={() => router.replace('/(auth)/login')} />
          </>
        )}
      </View>
    </Screen>
  );
}
