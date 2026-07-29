import { light, dark, semantic, brand } from './palette';

export type ThemeColors = typeof light;

export const themes = { light, dark } as const;
export { semantic, brand };
