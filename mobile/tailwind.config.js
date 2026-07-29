const { light, dark } = require('./src/theme/palette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: light.primary,
        'primary-dark': light.primaryDark,
        secondary: light.secondary,
        accent: light.accent,
        success: light.success,
        error: light.error,
        warning: light.warning,
        info: light.info,
        light: {
          background: light.background,
          surface: light.surface,
          'surface-alt': light.surfaceAlt,
          border: light.border,
          text: light.textPrimary,
          'text-secondary': light.textSecondary,
        },
        dark: {
          background: dark.background,
          surface: dark.surface,
          'surface-alt': dark.surfaceAlt,
          border: dark.border,
          text: dark.textPrimary,
          'text-secondary': dark.textSecondary,
        },
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
