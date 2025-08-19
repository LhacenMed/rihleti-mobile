import React, { useRef, useState } from "react";
import {
  TouchableWithoutFeedback,
  Animated,
  StyleProp,
  ViewStyle,
  View,
  StyleSheet,
} from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, style, onPress, className }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [isDimmed, setIsDimmed] = useState(false);

  const handlePressIn = () => {
    setIsDimmed(true);
    Animated.timing(scale, {
      toValue: 0.98,
      duration: 70,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsDimmed(false);
    Animated.timing(scale, {
      toValue: 1,
      useNativeDriver: true,
      duration: 100,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        className={`mb-4 flex-row items-center justify-center rounded-full bg-white px-6 py-4 ${className || ""}`}
        style={[style, { transform: [{ scale }] }]}
      >
        {children}
        {isDimmed && (
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
