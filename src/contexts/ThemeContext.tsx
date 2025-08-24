import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { View, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import type { ThemeMode, ThemeContextType } from "../types/theme";
import * as SystemUI from "expo-system-ui";
import { vars } from "nativewind";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@app_theme";

// Define theme variables using NativeWind's vars() function
const themes = {
  light: vars({
    "--background": "13 25% 97%",
    "--foreground": "0 0% 4%",
    "--card": "0 0% 100%",
    "--card-foreground": "0 0% 4%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "0 0% 4%",
    "--primary": "15 87% 56%",
    "--primary-foreground": "0 0% 98%",
    "--secondary": "0 0% 96%",
    "--secondary-foreground": "0 0% 4%",
    "--muted": "0 0% 96%",
    "--muted-foreground": "0 0% 45%",
    "--accent": "0 0% 96%",
    "--accent-foreground": "0 0% 4%",
    "--destructive": "0 84% 60%",
    "--destructive-foreground": "0 0% 98%",
    "--success": "142 76% 36%",
    "--success-foreground": "0 0% 98%",
    "--warning": "48 96% 56%",
    "--warning-foreground": "0 0% 4%",
    "--info": "200 98% 39%",
    "--info-foreground": "0 0% 98%",
    "--border": "0 0% 90%",
    "--input": "0 0% 90%",
    "--ring": "0 0% 4%",
    "--radius": "8px",
    "--sidebar-background": "210 40% 98%",
    "--sidebar-foreground": "0 0% 4%",
    "--sidebar-primary": "0 0% 4%",
    "--sidebar-primary-foreground": "0 0% 98%",
    "--sidebar-accent": "210 40% 96%",
    "--sidebar-accent-foreground": "0 0% 4%",
    "--sidebar-border": "0 0% 90%",
    "--seat-window": "217 91% 60%",
    "--seat-aisle": "142 76% 36%",
    "--seat-middle": "48 96% 56%",
    "--modal-background": "0 0% 100%",
    "--modal-foreground": "0 0% 100%",
    "--modal-border": "0 0% 15%",
    "--modal-input": "0 0% 15%",
    "--modal-ring": "0 0% 64%",
    "--modal-radius": "8px",
  }),
  dark: vars({
    "--background": "220 6% 9%",
    "--foreground": "0 0% 98%",
    "--card": "0 0% 4%",
    "--card-foreground": "0 0% 98%",
    "--popover": "0 0% 4%",
    "--popover-foreground": "0 0% 98%",
    "--primary": "15 87% 56%",
    "--primary-foreground": "0 0% 4%",
    "--secondary": "0 0% 15%",
    "--secondary-foreground": "0 0% 98%",
    "--muted": "0 0% 15%",
    "--muted-foreground": "0 0% 64%",
    "--accent": "0 0% 15%",
    "--accent-foreground": "0 0% 98%",
    "--destructive": "0 63% 51%",
    "--destructive-foreground": "0 0% 98%",
    "--success": "142 70% 45%",
    "--success-foreground": "0 0% 98%",
    "--warning": "32 95% 44%",
    "--warning-foreground": "0 0% 98%",
    "--info": "200 98% 48%",
    "--info-foreground": "0 0% 98%",
    "--border": "0 0% 15%",
    "--input": "0 0% 15%",
    "--ring": "0 0% 64%",
    "--radius": "8px",
    "--sidebar-background": "222 84% 5%",
    "--sidebar-foreground": "0 0% 98%",
    "--sidebar-primary": "0 0% 98%",
    "--sidebar-primary-foreground": "0 0% 4%",
    "--sidebar-accent": "215 28% 17%",
    "--sidebar-accent-foreground": "0 0% 98%",
    "--sidebar-border": "0 0% 15%",
    "--seat-window": "217 91% 60%",
    "--seat-aisle": "142 76% 36%",
    "--seat-middle": "48 96% 56%",
    "--modal-background": "0 0% 12%",
    "--modal-foreground": "0 0% 100%",
    "--modal-border": "0 0% 15%",
    "--modal-input": "0 0% 15%",
    "--modal-ring": "0 0% 64%",
    "--modal-radius": "8px",
  }),
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);

  // Determine current theme based on mode and system preference
  const currentTheme =
    mode === "system" ? systemColorScheme || "light" : mode === "dark" ? "dark" : "light";

  const isDark = currentTheme === "dark";

  // Update root background color when theme changes
  useEffect(() => {
    const updateRootBackground = async () => {
      try {
        // Use your CSS variables converted to hex colors
        const backgroundColor = isDark
          ? "#0a0a0a" // Dark theme (matches hsl(0, 0%, 4%))
          : "#ffffff"; // Light theme (matches hsl(0, 0%, 100%))

        await SystemUI.setBackgroundColorAsync(backgroundColor);
      } catch (error) {
        console.error("Failed to update root background color:", error);
      }
    };

    if (!isLoading) {
      updateRootBackground();
    }
  }, [isDark, isLoading]);

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
      <View style={themes[currentTheme]} className="flex-1">
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
