/**
 * Fonte única da paleta de cores do app — usada tanto pelo tailwind.config.js
 * (Node/CommonJS, sem build step) quanto pelo ThemeProvider em runtime
 * (importado por colors.ts). Evita ter as mesmas cores hardcoded em dois
 * lugares e divergindo com o tempo.
 */
const brand = {
  primary: '#FF7A00',
  primaryDark: '#E56A00',
  secondary: '#FFA94D',
  accent: '#FFB347',
};

const semantic = {
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

const light = {
  ...brand,
  ...semantic,
  background: '#FFF8EE',
  surface: '#FFFFFF',
  surfaceAlt: '#FFF1DE',
  border: '#F0E4D4',
  textPrimary: '#1E1E1E',
  textSecondary: '#666666',
  textInverse: '#FFFFFF',
  overlay: 'rgba(30, 20, 10, 0.45)',
};

const dark = {
  ...brand,
  ...semantic,
  // Modo escuro premium: preto aquecido com tons de carvão/marrom, nunca #000.
  background: '#151109',
  surface: '#211A12',
  surfaceAlt: '#2B2117',
  border: '#3A2E20',
  textPrimary: '#F5EDE2',
  textSecondary: '#B8A98F',
  textInverse: '#1E1E1E',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

module.exports = { brand, semantic, light, dark };
