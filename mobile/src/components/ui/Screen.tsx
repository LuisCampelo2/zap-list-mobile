import { KeyboardAvoidingView, Platform, ScrollView, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = ViewProps & {
  scroll?: boolean;
  /** Desliga o padding horizontal padrão (px-5) — usado por telas com listas
   * full-bleed (ex: FlashList) que controlam seu próprio espaçamento interno. */
  padded?: boolean;
  className?: string;
};

/**
 * Wrapper padrão de tela: respeita safe area, aplica o fundo do tema e evita
 * que o teclado cubra inputs em formulários (telas de auth, principalmente).
 */
export function Screen({ scroll = false, padded = true, className = '', children, ...props }: ScreenProps) {
  const Content = scroll ? ScrollView : View;

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <Content
          className={`flex-1 ${padded ? 'px-5' : ''} ${className}`}
          {...(scroll ? { keyboardShouldPersistTaps: 'handled', contentContainerStyle: { flexGrow: 1 } } : {})}
          {...props}
        >
          {children}
        </Content>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
