import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useDropdown } from "./Root";

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

  return (
    <TouchableOpacity
      ref={triggerRef}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={{ alignSelf: "flex-start" }}
    >
      {children}
    </TouchableOpacity>
  );
};
