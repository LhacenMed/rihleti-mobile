import React from "react";
import { Button } from "../button";
import { useDropdown } from "./Root";

interface ItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
  textClassName?: string;
}

export const Item: React.FC<ItemProps> = ({
  children,
  onSelect,
  disabled = false,
  destructive = false,
  className = "",
  textClassName = "",
}) => {
  const { setIsOpen } = useDropdown();

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      setIsOpen(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="default"
      disabled={disabled}
      onPress={handlePress}
      className={`mx-2 my-0.5 h-auto min-h-[36px] justify-start px-3 py-2  ${className}`}
      textClassName={`text-left text-sm ${
        destructive ? "text-red-600" : "text-foreground"
      } ${textClassName}`}
    >
      {children}
    </Button>
  );
};
