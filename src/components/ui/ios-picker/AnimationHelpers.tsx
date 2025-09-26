import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDecay as reanimatedWithDecay,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";

interface WithDecayConfig {
  velocity: number;
  snapPoints: number[];
  onSnap?: (value: number) => void;
}

export const useDecaySnap = (initialValue: number = 0) => {
  const translateY = useSharedValue(initialValue);

  const withDecaySnap = (config: WithDecayConfig) => {
    "worklet";
    const { velocity, snapPoints, onSnap } = config;

    // Use reanimated's withDecay and then snap to closest point
    const decayValue = reanimatedWithDecay({
      velocity,
      deceleration: 0.998,
    });

    const snapTarget = snapPoint(decayValue, velocity, snapPoints);

    const finalValue = withTiming(
      snapTarget,
      {
        duration: 300,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      },
      (finished) => {
        if (finished && onSnap) {
          runOnJS(onSnap)(snapTarget);
        }
      }
    );

    return finalValue;
  };

  return { translateY, withDecaySnap };
};
