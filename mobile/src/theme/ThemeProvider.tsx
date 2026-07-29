import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { preferencesStorage, storageKeys } from '../services/storage/preferencesStorage';
import { themes, type ThemeColors } from './colors';

type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  colors: ThemeColors;
  scheme: 'light' | 'dark';
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isValidPreference = (value: string | null | undefined): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system';

/**
 * Fonte única de verdade do tema: sincroniza a preferência do usuário
 * (persistida — ver preferencesStorage.ts) com o color scheme do NativeWind,
 * e expõe a paleta de cores tipada (theme/colors.ts) para componentes que
 * precisam do valor hex diretamente (ex: ícones do Lucide, que não aceitam
 * className). A leitura da preferência salva é assíncrona, então o app
 * começa em 'system' (já correto para quem nunca trocou o tema) e só ajusta
 * se o usuário tiver escolhido um override explícito antes.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    preferencesStorage.getItem(storageKeys.themePreference).then((stored) => {
      if (isValidPreference(stored)) setPreferenceState(stored);
    });
  }, []);

  useEffect(() => {
    setColorScheme(preference);
  }, [preference, setColorScheme]);

  const setPreference = (next: ThemePreference) => {
    preferencesStorage.setItem(storageKeys.themePreference, next);
    setPreferenceState(next);
  };

  const scheme = colorScheme ?? 'light';

  const value = useMemo<ThemeContextValue>(
    () => ({ colors: themes[scheme], scheme, preference, setPreference }),
    [scheme, preference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>');
  return ctx;
}
