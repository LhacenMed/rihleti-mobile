import React, { useEffect } from "react";
import { Modal, TouchableWithoutFeedback, Dimensions, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useDropdown } from "./Root";

interface ContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
  maxHeight?: number;
}

export const Content: React.FC<ContentProps> = ({
  children,
  align = "start",
  sideOffset = 0,
  className = "",
  maxHeight = 250,
}) => {
  const { isOpen, setIsOpen, triggerRef, contentRef } = useDropdown();
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 });
  const opacity = useSharedValue(0);
  const [render, setRender] = React.useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      // Reset animation state and mount
      opacity.value = 0;
      setRender(true);
    } else {
      // Animate out: fade and slide, then unmount
      opacity.value = withTiming(0, { duration: 150 }, (finished) => {
        "worklet";
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
      triggerRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        const screenWidth = Dimensions.get("window").width;
        const top = y + height * 2 + sideOffset; // position below trigger

        // Position dropdown to the left of the trigger
        const dropdownWidth = 200; // Estimated dropdown width (between min 160 and max 280)
        let left = x - dropdownWidth - sideOffset; // Position to the left with offset

        // Handle alignment options for left-side positioning
        if (align === "center") {
          left = x - dropdownWidth + width / 2;
        } else if (align === "end") {
          left = x + width;
        }

        // Ensure dropdown stays within screen bounds
        left = Math.max(8, Math.min(left, screenWidth - dropdownWidth));
        setPosition({ top, left, width });
      });
    }
  }, [isOpen, align, sideOffset]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: interpolate(opacity.value, [0, 1], [-8, 0]) }],
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
          style={[{ backgroundColor: "rgba(0, 0, 0, .3)" }, backdropStyle]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              ref={contentRef}
              className={`absolute overflow-hidden rounded-lg border border-border bg-background shadow-lg ${className}`}
              style={[
                {
                  top: position.top,
                  left: position.left,
                  minWidth: 150,
                  // maxWidth: 280,
                  maxHeight: maxHeight,
                },
                contentStyle,
              ]}
            >
              <ScrollView showsVerticalScrollIndicator={false} className="w-full">
                {children}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
