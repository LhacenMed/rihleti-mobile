import React from "react";
import { Pressable, Text, View } from "react-native";
import { useDropdown } from "./Root";
import { useTheme } from "@/contexts/ThemeContext";

interface ItemProps {
  title: string;
  icon?: (color: string) => React.ReactNode; // caller decides the icon component
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
  textClassName?: string;
}

export const Item: React.FC<ItemProps> = ({
  title,
  icon,
  onSelect,
  disabled = false,
  destructive = false,
  className = "",
  textClassName = "",
}) => {
  const { setIsOpen } = useDropdown();
  const { isDark } = useTheme();

  const handlePress = () => {
    if (disabled) return;
    onSelect?.();
    setIsOpen(false);
  };

  const iconColor = destructive ? "#dc2626" : "#6b7280"; // red-600 or gray-500

  const dimBackgroundColor = isDark ? "rgba(225, 225, 225, 0.12)" : "rgba(0, 0, 0, 0.12)";
  const dangerDimBackgroundColor = isDark ? "rgba(255, 69, 69, 0.18)" : "rgba(255, 69, 69, 0.18)";

  const rippleColor = destructive ? dangerDimBackgroundColor : dimBackgroundColor;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={handlePress}
      className={`w-full flex-row items-center gap-3 rounded-md px-3 py-3 active:bg-muted/10 ${
        disabled ? "opacity-50" : ""
      } ${className}`}
      android_ripple={
        disabled
          ? undefined
          : {
              color: rippleColor,
              borderless: false,
              foreground: true,
            }
      }
    >
      <View className="items-center justify-center">{icon ? icon(iconColor) : null}</View>
      <Text
        className={`flex-1 text-base ${
          destructive ? "text-red-600" : "text-foreground"
        } ${textClassName}`}
        numberOfLines={1}
      >
        {title}
      </Text>
    </Pressable>
  );
};
