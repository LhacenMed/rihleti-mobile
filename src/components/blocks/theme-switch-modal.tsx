// theme-switch-modal.tsx
import { useState, useRef } from "react";
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
      <RadioButton.Group onValueChange={handleThemeSelect} value={selectedTheme}>
        {themeOptions.map((option) => (
          <RadioButton.Item
            key={option.value}
            label={option.label}
            value={option.value}
            color={isDark ? "#BB86FC" : "#6200EE"}
            uncheckedColor={isDark ? "#ccc" : "#555"}
            labelStyle={{
              color: isDark ? "#fff" : "#000",
              fontSize: 18,
              fontFamily: "Outfit-Regular",
            }}
            rippleColor="transparent"
          />
        ))}
      </RadioButton.Group>
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
