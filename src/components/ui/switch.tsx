import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, StyleProp, ViewStyle, ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import Loader from "./loader";

interface SwitchProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void | Promise<void>;
  trackColor?: { true: string; false: string };
  thumbColor?: { true: string; false: string };
  style?: StyleProp<ViewStyle>;
  loading?: boolean; // external loading control (optional)
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  trackColor = { true: "#34C759", false: "#E5E5EA" },
  thumbColor = { true: "#ffffff", false: "#ffffff" },
  style,
  loading: externalLoading = false,
}) => {
  const springConfig = {
    stiffness: 1500,
    damping: 150,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
  };

  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);

  const switchWidth = 55;
  const thumbRadius = 18;
  const thumbSize = thumbRadius * 2;
  const padding = 0;

  const [isOn, setIsOn] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const computedLoading = isLoading || externalLoading;

  const translateX = useSharedValue(value ? switchWidth - thumbSize - padding : 0);
  const loadingProgress = useSharedValue(0);

  const circleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: circleScale.value }],
    opacity: circleOpacity.value,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  }));

  // Update the useEffect hook to respond to the `value` prop changes
  useEffect(() => {
    if (!computedLoading) {
      setIsOn(value);
      translateX.value = withSpring(value ? switchWidth - thumbSize - padding : 0, springConfig);
    }
  }, [value, computedLoading]);

  const handleValueChange = async (newValue: boolean) => {
    setIsLoading(true);
    loadingProgress.value = withTiming(1, { duration: 200 });

    try {
      // Trigger haptic feedback
      Haptics.selectionAsync();

      // Call the onValueChange function and await if it returns a promise
      const result = onValueChange(newValue);
      if (result instanceof Promise) {
        await result;
      }

      // Update state and animate only after promise resolves
      setIsOn(newValue);
      translateX.value = withSpring(newValue ? switchWidth - thumbSize - padding : 0, springConfig);
    } catch (error) {
      // If promise rejects, don't change the state
      console.error("Switch value change failed:", error);
    } finally {
      setIsLoading(false);
      loadingProgress.value = withTiming(0, { duration: 200 });
    }
  };

  const toggleSwitch = () => {
    if (isLoading) return; // Prevent action during loading

    const newValue = !isOn;
    handleValueChange(newValue);
  };

  const scale = useSharedValue(1);

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
    backgroundColor: interpolateColor(
      translateX.value,
      [0, switchWidth - thumbSize - padding],
      [thumbColor.false, thumbColor.true]
    ),
  }));

  const gesture = Gesture.Pan()
    .enabled(!computedLoading) // Disable gesture during loading
    .onBegin(() => {
      scale.value = withSpring(0.7, springConfig);
      circleScale.value = withSpring(1.5, springConfig);
      circleOpacity.value = withSpring(1, springConfig);
    })
    .onUpdate((e) => {
      translateX.value = Math.min(
        Math.max(e.translationX + (isOn ? switchWidth - thumbSize - padding : 0), 0),
        switchWidth - thumbSize - padding
      );
    })
    .onEnd(() => {
      scale.value = withSpring(1, springConfig);
      circleScale.value = withSpring(0, springConfig);
      circleOpacity.value = withSpring(0, springConfig);

      const midpoint = (switchWidth - thumbSize - padding) / 2;
      const newValue = translateX.value > midpoint;

      // Reset position temporarily during loading
      translateX.value = withSpring(isOn ? switchWidth - thumbSize - padding : 0, springConfig);

      // Handle the value change with loading
      runOnJS(handleValueChange)(newValue);
    })
    .onFinalize(() => {
      scale.value = withSpring(1, springConfig);
      circleScale.value = withSpring(0, springConfig);
      circleOpacity.value = withSpring(0, springConfig);
    });

  const trackAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      translateX.value,
      [0, switchWidth - thumbSize - padding],
      [trackColor.false, trackColor.true]
    ),
    opacity: 1 - 0.4 * loadingProgress.value, // Animate dimming during loading
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Pressable
        onPress={toggleSwitch}
        style={[styles.container, style]}
        disabled={computedLoading}
      >
        <Animated.View style={[styles.track, trackAnimatedStyle]} />
        <Animated.View
          style={[
            {
              position: "absolute",
              width: 22,
              height: 22,
              borderRadius: (thumbSize + 10) / 2,
              left: 2,
            },
            circleAnimatedStyle,
          ]}
        />
        <Animated.View style={[styles.thumb, thumbAnimatedStyle]}>
          {computedLoading && (
            <Loader
              // size="small"
              color={isOn ? trackColor.true : "#666666"}
              style={styles.activityIndicator}
            />
          )}
        </Animated.View>
      </Pressable>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 25,
    justifyContent: "center",
    borderRadius: 15,
    padding: 4,
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  thumb: {
    width: 20,
    height: 20,
    left: 3,
    borderRadius: 50,
    position: "absolute",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicator: {
    position: "absolute",
  },
});

// Example usage:
// const [switchValue, setSwitchValue] = useState(false);
//
// const handleSwitchChange = async (newValue: boolean) => {
//   // Simulate an API call
//   await new Promise(resolve => setTimeout(resolve, 2000));
//   setSwitchValue(newValue);
// };
//
// <Switch
//   value={switchValue}
//   onValueChange={handleSwitchChange}
// />
