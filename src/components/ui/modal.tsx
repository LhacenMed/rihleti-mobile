import React, { useRef, useEffect } from "react";
import { Text, View, Animated, TouchableWithoutFeedback, Pressable } from "react-native";
import { ModalContentProps } from "@whitespectre/rn-modal-presenter";
import { useTheme } from "@contexts/ThemeContext";

interface ModalButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "destructive" | "cancel";
}

interface ModalProps {
  header?: string;
  children: React.ReactNode;
  buttons: ModalButton[];
}

const Modal = ({
  dismiss,
  header,
  children,
  buttons = [{ text: "OK" }],
}: ModalProps & ModalContentProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { isDark } = useTheme();

  useEffect(() => {
    // Slide up animation on mount
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDismiss = () => {
    // Slide down animation before dismissing
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dismiss();
    });
  };

  const handleButtonPress = (button: ModalButton) => {
    if (button.onPress) {
      button.onPress();
    }
    handleDismiss();
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1, 1.2],
    outputRange: [25, 0, -25],
  });

  const getButtonTextColor = (style?: string) => {
    switch (style) {
      case "destructive":
        return "#FF453A"; // iOS red
      case "cancel":
        return "#8E8E93"; // iOS gray
      default:
        return "#007AFF"; // iOS blue
    }
  };

  const getButtonTextWeight = (style?: string) => {
    return style === "cancel" ? "normal" : "600";
  };

  const backgroundColor = isDark ? "#1E1E1E" : "#ffffff";
  const dimBackgroundColor = isDark ? "#2A2A2A" : "rgb(241, 241, 241)";
  const dangerDimBackgroundColor = isDark ? "#2A1F1F" : "#FFE8E8";

  // Button component with press animation
  const AnimatedButton = ({
    button,
    index,
    isFullWidth,
  }: {
    button: ModalButton;
    index: number;
    isFullWidth?: boolean;
  }) => {
    const buttonFadeAnim = useRef(new Animated.Value(0)).current;
    const isDanger = button.style === "destructive";

    const handlePressIn = () => {
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        useNativeDriver: false,
        duration: 0,
      }).start();
    };

    const handlePressOut = () => {
      Animated.timing(buttonFadeAnim, {
        toValue: 0,
        useNativeDriver: false,
        duration: 200,
      }).start();
    };

    const animatedBackgroundColor = buttonFadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["transparent", isDanger ? dangerDimBackgroundColor : dimBackgroundColor],
    });

    const buttonStyle = {
      paddingVertical: 16,
      backgroundColor: animatedBackgroundColor,
      // ...(isFullWidth ? {} : { flex: 1 }),
    };

    return (
      <View key={index} style={isFullWidth ? {} : { flex: 1 }}>
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => handleButtonPress(button)}
        >
          <Animated.View style={buttonStyle}>
            <Text
              className="text-center text-lg"
              style={{
                fontWeight: getButtonTextWeight(button.style),
                color: getButtonTextColor(button.style),
              }}
            >
              {button.text}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        {/* Vertical separator */}
        {!isFullWidth && index < buttons.length - 1 && (
          <View className="absolute bottom-0 right-0 top-0 w-px bg-border" />
        )}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismiss}>
      <Animated.View
        className="absolute inset-0 items-center justify-center px-8"
        style={{
          opacity: fadeAnim,
        }}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <Animated.View
            className="w-full max-w-xs overflow-hidden rounded-2xl bg-card"
            style={{
              transform: [{ translateY }],
            }}
          >
            {/* Header */}
            {header && (
              <View className="border-b border-border px-4 py-4">
                <Text className="text-center text-lg font-semibold text-card-foreground">
                  {header}
                </Text>
              </View>
            )}

            {/* Body */}
            <View>{children}</View>

            {/* Footer - Action Buttons */}
            <View className="border-t border-border">
              {buttons.length === 1 ? (
                // Single button
                <AnimatedButton button={buttons[0]} index={0} isFullWidth={true} />
              ) : (
                // Two buttons side by side
                <View className="flex-row">
                  {buttons.map((button, index) => (
                    <AnimatedButton key={index} button={button} index={index} isFullWidth={false} />
                  ))}
                </View>
              )}
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Modal;
