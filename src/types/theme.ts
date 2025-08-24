export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: ThemeMode; // The user's selected theme mode
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean; // Whether the current resolved theme is dark
}
