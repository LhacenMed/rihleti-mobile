import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import {
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  Platform,
  Switch as RNSwitch,
} from "react-native";
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
  loading?: boolean;
}

export interface SwitchRef {
  triggerPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export const Switch = forwardRef<SwitchRef, SwitchProps>(
  (
    {
      value,
      onValueChange,
      trackColor = { true: "#34C759", false: "#666" },
      thumbColor = { true: "#fff", false: "#fff" },
      style,
      loading: externalLoading = false,
    },
    ref
  ) => {
    // On iOS, use the native Switch for platform-consistent look/feel
    // Remove this if statement if it's causing issues
    if (Platform.OS === "ios") {
      const handleValueChange = async (newValue: boolean) => {
        try {
          Haptics.selectionAsync();
          const result = onValueChange(newValue);
          if (result instanceof Promise) {
            await result;
          }
        } catch (error) {
          console.error("Switch value change failed:", error);
        }
      };

      const toggleSwitch = () => {
        if (externalLoading) return;
        const newValue = !value;
        handleValueChange(newValue);
      };

      const triggerPressAnimation = () => {
        if (externalLoading) return;
        toggleSwitch();
      };

      const onPressIn = () => {
        if (externalLoading) return;
        // iOS native switch doesn't need press animations
      };

      const onPressOut = () => {
        if (externalLoading) return;
        // iOS native switch doesn't need press animations
      };

      // Expose methods to parent components for iOS switch
      useImperativeHandle(ref, () => ({
        triggerPress: triggerPressAnimation,
        onPressIn,
        onPressOut,
      }));

      return (
        <RNSwitch
          value={value}
          onValueChange={onValueChange}
          trackColor={trackColor}
          thumbColor={value ? thumbColor.true : thumbColor.false}
          ios_backgroundColor={trackColor.false}
          style={style}
          disabled={externalLoading}
        />
      );
    }

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
    const scale = useSharedValue(1);

    const circleAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }, { scale: circleScale.value }],
      opacity: circleOpacity.value,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    }));

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
        Haptics.selectionAsync();

        const result = onValueChange(newValue);
        if (result instanceof Promise) {
          await result;
        }

        setIsOn(newValue);
        translateX.value = withSpring(
          newValue ? switchWidth - thumbSize - padding : 0,
          springConfig
        );
      } catch (error) {
        console.error("Switch value change failed:", error);
      } finally {
        setIsLoading(false);
        loadingProgress.value = withTiming(0, { duration: 200 });
      }
    };

    const toggleSwitch = () => {
      if (computedLoading) return;
      const newValue = !isOn;
      handleValueChange(newValue);
    };

    const isDragging = useSharedValue(false);

    const onPressIn = () => {
      if (computedLoading || isDragging.value) return;
      scale.value = withSpring(0.7, springConfig);
      // circleScale.value = withSpring(1.5, springConfig);
      // circleOpacity.value = withSpring(1, springConfig);
    };

    const onPressOut = () => {
      if (computedLoading || isDragging.value) return;
      scale.value = withSpring(1, springConfig);
      // circleScale.value = withSpring(0, springConfig);
      // circleOpacity.value = withSpring(0, springConfig);
    };

    const triggerPressAnimation = () => {
      if (computedLoading) return;

      // Trigger the press animation
      scale.value = withSpring(0.7, springConfig, () => {
        scale.value = withSpring(1, springConfig);
      });

      // Toggle the switch
      toggleSwitch();
    };

    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
      triggerPress: triggerPressAnimation,
      onPressIn,
      onPressOut,
    }));

    const thumbAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }, { scale: scale.value }],
      backgroundColor: interpolateColor(
        translateX.value,
        [0, switchWidth - thumbSize - padding],
        [thumbColor.false, thumbColor.true]
      ),
    }));

    const gesture = Gesture.Pan()
      .enabled(!computedLoading)
      .onBegin(() => {
        isDragging.value = true;
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

        translateX.value = withSpring(isOn ? switchWidth - thumbSize - padding : 0, springConfig);
        runOnJS(handleValueChange)(newValue);
      })
      .onFinalize(() => {
        isDragging.value = false;
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
      opacity: 1 - 0.4 * loadingProgress.value,
    }));

    return (
      <GestureDetector gesture={gesture}>
        <Pressable
          onPress={toggleSwitch}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
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
              <Loader color={isOn ? trackColor.true : "#666"} style={styles.activityIndicator} />
            )}
          </Animated.View>
        </Pressable>
      </GestureDetector>
    );
  }
);

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
