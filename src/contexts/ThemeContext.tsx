import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { View, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { vars } from "nativewind";
import type { ThemeMode, ThemeContextType } from "../types/theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@app_theme";

// Define theme variables using NativeWind's vars()
const themes = {
  light: vars({
    "--background": "255 255 255",
    "--foreground": "10 10 10",
    "--card": "255 255 255",
    "--card-foreground": "10 10 10",
    "--popover": "255 255 255",
    "--popover-foreground": "10 10 10",
    "--primary": "10 10 10",
    "--primary-foreground": "250 250 250",
    "--secondary": "245 245 245",
    "--secondary-foreground": "10 10 10",
    "--muted": "245 245 245",
    "--muted-foreground": "115 115 115",
    "--accent": "245 245 245",
    "--accent-foreground": "10 10 10",
    "--destructive": "239 68 68",
    "--destructive-foreground": "250 250 250",
    "--success": "34 197 94",
    "--success-foreground": "250 250 250",
    "--warning": "251 191 36",
    "--warning-foreground": "10 10 10",
    "--border": "229 229 229",
    "--input": "229 229 229",
    "--ring": "10 10 10",
    "--radius": "8px",
    "--sidebar-background": "248 250 252",
    "--sidebar-foreground": "10 10 10",
    "--sidebar-primary": "10 10 10",
    "--sidebar-primary-foreground": "250 250 250",
    "--sidebar-accent": "241 245 249",
    "--sidebar-accent-foreground": "10 10 10",
    "--sidebar-border": "229 229 229",
    "--seat-window": "59 130 246",
    "--seat-aisle": "34 197 94",
    "--seat-middle": "251 191 36",
  }),
  dark: vars({
    "--background": "10 10 10",
    "--foreground": "250 250 250",
    "--card": "10 10 10",
    "--card-foreground": "250 250 250",
    "--popover": "10 10 10",
    "--popover-foreground": "250 250 250",
    "--primary": "250 250 250",
    "--primary-foreground": "10 10 10",
    "--secondary": "38 38 38",
    "--secondary-foreground": "250 250 250",
    "--muted": "38 38 38",
    "--muted-foreground": "163 163 163",
    "--accent": "38 38 38",
    "--accent-foreground": "250 250 250",
    "--destructive": "220 38 38",
    "--destructive-foreground": "250 250 250",
    "--success": "22 163 74",
    "--success-foreground": "250 250 250",
    "--warning": "217 119 6",
    "--warning-foreground": "250 250 250",
    "--border": "38 38 38",
    "--input": "38 38 38",
    "--ring": "163 163 163",
    "--radius": "8px",
    "--sidebar-background": "15 23 42",
    "--sidebar-foreground": "250 250 250",
    "--sidebar-primary": "250 250 250",
    "--sidebar-primary-foreground": "10 10 10",
    "--sidebar-accent": "30 41 59",
    "--sidebar-accent-foreground": "250 250 250",
    "--sidebar-border": "38 38 38",
    "--seat-window": "59 130 246",
    "--seat-aisle": "34 197 94",
    "--seat-middle": "251 191 36",
  }),
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  console.log("System color scheme:", systemColorScheme); 
  const [mode, setMode] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);

  // Determine current theme based on mode and system preference
  const currentTheme =
    mode === "system" ? systemColorScheme || "light" : mode === "dark" ? "dark" : "light";

  const isDark = currentTheme === "dark";

  // Load saved theme preference on mount
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedMode = (await AsyncStorage.getItem(THEME_STORAGE_KEY)) as ThemeMode | null;

        if (savedMode === "light" || savedMode === "dark" || savedMode === "system") {
          setMode(savedMode);
        } else {
          setMode("system"); // Default to system
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        setMode("system");
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedTheme();
  }, []);

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
  };

  if (isLoading) {
    return null;
  }

  const contextValue: ThemeContextType = {
    theme: mode,
    setTheme: setThemeMode,
    isDark,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <View style={themes[isDark ? "dark" : "light"]} className="flex-1">
        {children}
      </View>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
