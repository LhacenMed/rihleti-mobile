import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import type { ThemeMode } from "../../types/theme";

interface ThemeOption {
  key: ThemeMode;
  label: string;
  icon: string;
}

const themeOptions: ThemeOption[] = [
  { key: "light", label: "Light", icon: "☀️" },
  { key: "dark", label: "Dark", icon: "🌙" },
  { key: "system", label: "System", icon: "💻" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <View className="flex-row rounded-lg border border-border bg-card p-1">
      {themeOptions.map((option) => {
        const isActive = theme === option.key;

        return (
          <TouchableOpacity
            key={option.key}
            onPress={() => setTheme(option.key)}
            className={`
              flex-1 flex-row items-center justify-center rounded-md px-3 py-2
              ${isActive ? "bg-primary" : "bg-transparent"}
            `}
          >
            <Text className="mr-2">{option.icon}</Text>
            <Text
              className={`
                text-sm font-medium
                ${isActive ? "text-primary-foreground" : "text-foreground"}
              `}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
