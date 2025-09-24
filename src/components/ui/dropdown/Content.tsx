import React, { useEffect } from "react";
import { Modal, TouchableWithoutFeedback, Dimensions, ScrollView, View } from "react-native";
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
  maxHeight?: number; // maximum dropdown height before content becomes scrollable
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
  const heightFactor = useSharedValue(1);
  const measuredHeight = useSharedValue(0);
  const measuredOnce = React.useRef(false);

  useEffect(() => {
    if (isOpen) {
      // Reset animation and measurement state
      opacity.value = 0;
      heightFactor.value = 1;
      measuredOnce.current = false;
      measuredHeight.value = 0;
      setRender(true);
    } else {
      // Animate out: fade, slide (via opacity), and fold height to 50%
      heightFactor.value = withTiming(0.5, { duration: 150 });
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
        const top = y + height + sideOffset; // position below trigger
        let left = x;

        if (align === "center") left = x + width / 2;
        else if (align === "end") left = x + width;

        left = Math.max(8, Math.min(left, screenWidth));
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

  // Height unfold in/out (50% <-> 100% of measured content height)
  const sizeStyle = useAnimatedStyle(() => {
    const h = measuredHeight.value;
    if (h <= 0) return {} as any;
    return { height: h * heightFactor.value } as const;
  });

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
              onLayout={(e) => {
                if (measuredOnce.current) return;
                const natural = e.nativeEvent.layout.height;
                if (natural > 0) {
                  measuredOnce.current = true;
                  measuredHeight.value = Math.min(natural, maxHeight);
                  if (isOpen) {
                    heightFactor.value = 0.5;
                    heightFactor.value = withTiming(1, { duration: 150 });
                  }
                }
              }}
              className={`absolute overflow-hidden rounded-lg border border-border bg-background shadow-lg ${className}`}
              style={[
                {
                  top: position.top,
                  left: position.left,
                  minWidth: 160,
                  maxWidth: 280,
                  zIndex: 50,
                },
                contentStyle,
                sizeStyle,
              ]}
            >
              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View className="">{children}</View>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
