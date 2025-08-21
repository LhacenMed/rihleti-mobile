import React, { useRef, useState } from "react";
import {
  TouchableWithoutFeedback,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
  Text,
  StyleSheet,
} from "react-native";

// Button variant configurations using Tailwind-style class names
const buttonVariants = {
  variant: {
    default: "bg-white border border-gray-200",
    primary: "bg-blue-500 border border-blue-500",
    destructive: "bg-red-500 border border-red-500",
    outline: "bg-transparent border border-gray-200",
    secondary: "bg-gray-100 border border-gray-100",
    ghost: "bg-transparent border border-transparent",
    link: "bg-transparent border border-transparent",
  },
  size: {
    default: "h-9 px-4 py-2 rounded-md",
    sm: "h-8 px-3 py-1.5 rounded-md text-xs",
    lg: "h-10 px-8 py-2.5 rounded-md text-base",
    xl: "h-12 px-10 py-3 rounded-md text-lg",
    icon: "h-9 w-9 p-0 rounded-md",
    primary: "h-[42px] px-4 py-2 rounded-full w-full",
  },
  textVariant: {
    default: "text-black font-medium",
    primary: "text-white font-medium",
    destructive: "text-white font-medium",
    outline: "text-gray-700 font-medium",
    secondary: "text-gray-700 font-medium",
    ghost: "text-gray-700 font-medium",
    link: "text-blue-500 font-medium underline",
  },
};

export interface ButtonProps {
  children: React.ReactNode;
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  className?: string;
  textClassName?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  disabled = false,
  onPress,
  style,
  textStyle,
  className = "",
  textClassName = "",
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    if (disabled) return;
    setIsPressed(true);
    Animated.timing(scale, {
      toValue: 0.98,
      duration: 70,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    setIsPressed(false);
    Animated.timing(scale, {
      toValue: 1,
      useNativeDriver: true,
      duration: 100,
    }).start();
  };

  const getButtonClasses = () => {
    const baseClasses = "flex-row items-center justify-center";
    const variantClasses = buttonVariants.variant[variant];
    const sizeClasses = buttonVariants.size[size];
    const pressedClasses = isPressed ? getPressedClasses() : "";
    const disabledClasses = disabled ? "opacity-50" : "";

    return `${baseClasses} ${variantClasses} ${sizeClasses} ${pressedClasses} ${disabledClasses} ${className}`.trim();
  };

  const getTextClasses = () => {
    const baseTextClasses = buttonVariants.textVariant[variant];
    const sizeTextClasses = getSizeTextClasses();
    const disabledTextClasses = disabled ? "opacity-50" : "";

    return `${baseTextClasses} ${sizeTextClasses} ${disabledTextClasses} ${textClassName}`.trim();
  };

  const getPressedClasses = () => {
    switch (variant) {
      case "default":
        return "bg-gray-50";
      case "primary":
        return "bg-blue-600";
      case "destructive":
        return "bg-red-600";
      case "outline":
        return "bg-gray-50";
      case "secondary":
        return "bg-gray-200";
      case "ghost":
        return "bg-gray-100";
      default:
        return "";
    }
  };

  const getSizeTextClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      case "xl":
        return "text-lg";
      default:
        return "text-sm";
    }
  };

  const renderContent = () => {
    if (typeof children === "string") {
      return (
        <Text className={getTextClasses()} style={textStyle}>
          {children}
        </Text>
      );
    }
    return children;
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Animated.View
        className={getButtonClasses()}
        style={[
          style,
          {
            transform: [{ scale }],
          },
        ]}
      >
        {renderContent()}
        {isPressed && !disabled && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: 50,
            }}
          />
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// Helper function to get button variants for external use
export const getButtonVariants = () => buttonVariants;

export default Button;
