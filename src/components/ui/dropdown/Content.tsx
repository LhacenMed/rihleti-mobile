import React, { useEffect } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
// import {runOnJS} from "react-native-worklets";
import { useDropdown } from "./Root";

interface ContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
}

export const Content: React.FC<ContentProps> = ({
  children,
  align = "start",
  sideOffset = 0,
  className = "",
}) => {
  const { isOpen, setIsOpen, triggerRef, contentRef } = useDropdown();
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 });
  const opacity = useSharedValue(0);
  const [render, setRender] = React.useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      // Ensure starting value before mounting so first frame renders at 0
      opacity.value = 0;
      setRender(true);
    } else {
      opacity.value = withTiming(0, { duration: 150 }, (finished) => {
        'worklet';
        if (finished) scheduleOnRN(setRender, false);
      });
    }
  }, [isOpen]);

  // Start enter animation after the modal content mounts
  useEffect(() => {
    if (render && isOpen) {
      const id = requestAnimationFrame(() => {
        opacity.value = withTiming(1, { duration: 200 });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [render, isOpen]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      triggerRef.current.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          const screenWidth = Dimensions.get("window").width;
          let top = y - sideOffset;
          let left = x;
          
          if (align === "center") left = x + width / 2;
          else if (align === "end") left = x + width;
          
          left = Math.max(8, Math.min(left, screenWidth));
          setPosition({ top, left, width });
        }
      );
    }
  }, [isOpen, align, sideOffset]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: 34 },
      { scale: interpolate(opacity.value, [0, 1], [0.95, 1]) },
    ],
  }));

  if (!render) return null;

  return (
    <Modal
      transparent
      visible={render}
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => setIsOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
        <Animated.View
          className="absolute inset-0"
          style={[{ backgroundColor: "rgba(0,0,0,0.5)" }, backdropStyle]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              ref={contentRef}
              className={`absolute rounded-lg border border-border bg-background shadow-lg ${className}`}
              style={[
                {
                  top: position.top,
                  left: position.left,
                  minWidth: 160,
                  maxWidth: 280,
                  zIndex: 50,
                  // elevation: Platform.OS === "android" ? 10 : 0,
                  // shadowColor: "#000",
                  // shadowOffset: { width: 0, height: 2 },
                  // shadowOpacity: 0.25,
                  // shadowRadius: 8,
                },
                contentStyle,
              ]}
            >
              <ScrollView className="py-2" showsVerticalScrollIndicator={false} bounces={false}>
                {children}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
