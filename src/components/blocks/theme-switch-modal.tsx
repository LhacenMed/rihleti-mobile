// theme-switch-modal.tsx
import { useState, useRef } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { showModal } from "@whitespectre/rn-modal-presenter";
import { RadioButton } from "react-native-paper";
import Modal from "@/components/ui/modal";
import { useTheme } from "@/contexts/ThemeContext";
import type { ThemeMode } from "@/types/theme";

// Theme options
const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

// Export the trigger function
export const showThemeSwitchModal = () => {
  let selectedThemeRef: ThemeMode | null = null;
  let setThemeRef: ((theme: ThemeMode) => void) | null = null;

  const ThemeSwitchModalContent = () => {
    const { isDark, theme, setTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(theme);

    // Store refs for button access
    selectedThemeRef = selectedTheme;
    setThemeRef = setTheme;

    const handleThemeSelect = (value: string) => {
      const themeMode = value as ThemeMode;
      setSelectedTheme(themeMode);
      selectedThemeRef = themeMode;
    };

    return (
      <View>
        {themeOptions.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => handleThemeSelect(option.value)}
            android_ripple={{
              color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              borderless: false,
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 16,
              minHeight: 48,
            }}
          >
            <Text
              style={{
                color: isDark ? "#fff" : "#000",
                fontSize: 15,
                marginLeft: 8,
                flex: 1,
              }}
            >
              {option.label}
            </Text>
            <RadioButton
              value={option.value}
              status={selectedTheme === option.value ? "checked" : "unchecked"}
              onPress={() => handleThemeSelect(option.value)}
              color={isDark ? "hsl(15 87% 56%)" : "hsl(15 87% 56%)"}
              uncheckedColor={isDark ? "#ccc" : "#555"}
            />
          </Pressable>
        ))}
      </View>
    );
  };

  showModal(Modal, {
    header: "Theme",
    hasHeader: true,
    children: <ThemeSwitchModalContent />,
    buttons: [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Apply",
        style: "default",
        onPress: () => {
          // Delay theme application to prevent re-render during dismiss
          setTimeout(() => {
            if (selectedThemeRef && setThemeRef) {
              setThemeRef(selectedThemeRef);
            }
          }, 100); // Wait for dismiss animation to start
        },
      },
    ],
  });
};
