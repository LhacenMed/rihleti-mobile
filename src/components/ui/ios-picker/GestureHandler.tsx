import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  SharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { snapPoint } from "react-native-redash";
import { ITEM_HEIGHT } from "./Constants";

interface GestureHandlerProps {
  translateY: SharedValue<number>;
  max: number;
  defaultValue: number;
  onValueChange?: (value: number) => void;
}

const GestureHandler = ({ translateY, max, defaultValue, onValueChange }: GestureHandlerProps) => {
  const context = useSharedValue({ y: 0 });
  const snapPoints = Array.from({ length: max }, (_, i) => i * -ITEM_HEIGHT);

  const handleValueChange = (value: number) => {
    if (onValueChange) {
      const index = Math.round(-value / ITEM_HEIGHT);
      onValueChange(index);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = context.value.y + event.translationY;
    })
    .onEnd((event) => {
      const snapTarget = snapPoint(translateY.value, event.velocityY, snapPoints);

      translateY.value = withTiming(
        snapTarget,
        {
          duration: 300,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        },
        (finished) => {
          if (finished) {
            runOnJS(handleValueChange)(snapTarget);
          }
        }
      );
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} />
    </GestureDetector>
  );
};

export default GestureHandler;
