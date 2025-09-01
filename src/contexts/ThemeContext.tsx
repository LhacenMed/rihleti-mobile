import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { View, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import type { ThemeMode, ThemeContextType } from "../types/theme";
import * as SystemUI from "expo-system-ui";
import { themes } from "@/lib/theme-variables";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@app_theme";

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
