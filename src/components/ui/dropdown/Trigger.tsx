import React from "react";
import { TouchableOpacity, Pressable } from "react-native";
import { useDropdown } from "./Root";
import { useTheme } from "@/contexts/ThemeContext";

interface TriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  disabled?: boolean;
}

export const Trigger: React.FC<TriggerProps> = ({
  children,
  asChild = false,
  disabled = false,
}) => {
  const { isOpen, setIsOpen, triggerRef } = useDropdown();
  const { isDark } = useTheme();

  const handlePress = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      ref: triggerRef,
      onPress: handlePress,
      disabled,
    });
  }

  const rippleColor = isDark ? "rgba(225, 225, 225, 0.12)" : "rgba(0, 0, 0, 0.12)";

  return (
    <Pressable
      ref={triggerRef}
      onPress={handlePress}
      disabled={disabled}
      // activeOpacity={0.7}
      android_ripple={
        disabled
          ? undefined
          : {
              color: rippleColor,
              borderless: false,
              foreground: true,
            }
      }
      style={{ alignSelf: "flex-end" }}
      className="rounded-full bg-transparent"
    >
      {children}
    </Pressable>
  );
};
