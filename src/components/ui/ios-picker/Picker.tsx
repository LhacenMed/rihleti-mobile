// Picker.tsx
import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Animated, {
  interpolate,
  Extrapolation,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
// import MaskedView from "@react-native-community/masked-view";
import GestureHandler from "./GestureHandler";
import { VISIBLE_ITEMS, ITEM_HEIGHT } from "./Constants";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width: 0.61 * width,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: "hidden",
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontFamily: "System", // Updated font family for cross-platform compatibility
    fontSize: 24,
    lineHeight: ITEM_HEIGHT,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

const perspective = 600;
const RADIUS_REL = VISIBLE_ITEMS * 0.5;
const RADIUS = RADIUS_REL * ITEM_HEIGHT;

interface PickerProps {
  defaultValue: number;
  values: { value: number; label: string }[];
  onValueChange?: (value: number) => void;
}

const Picker = ({ values, defaultValue, onValueChange }: PickerProps) => {
  const translateY = useSharedValue(-defaultValue * ITEM_HEIGHT);

  const maskElement = (
    <Animated.View
      style={useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
      }))}
    >
      {values.map((v, i) => {
        const animatedStyle = useAnimatedStyle(() => {
          const inputRange = [i - RADIUS_REL, i, i + RADIUS_REL];
          const y = interpolate(
            (translateY.value + ITEM_HEIGHT * 2) / -ITEM_HEIGHT,
            inputRange,
            [-1, 0, 1],
            Extrapolation.CLAMP
          );

          const rotateX = Math.asin(y);
          // React Native requires rotation values to be strings with units (deg or rad)
          const rotateXStr = `${rotateX}rad`;

          // Build transform; translateZ is not supported in RN
          const transforms: any[] = [{ perspective }, { rotateX: rotateXStr }];

          return {
            transform: transforms,
          };
        });

        return (
          <Animated.View key={v.value} style={[styles.item, animatedStyle]}>
            <Text style={styles.label}>{v.label}</Text>
          </Animated.View>
        );
      })}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <MaskedView maskElement={maskElement}>
        <View style={{ height: ITEM_HEIGHT * 2, backgroundColor: "grey" }} />
        <View style={{ height: ITEM_HEIGHT, backgroundColor: "white" }} />
        <View style={{ height: ITEM_HEIGHT * 2, backgroundColor: "grey" }} />
      </MaskedView>
      <View style={StyleSheet.absoluteFill}>
        <View
          style={{
            borderColor: "grey",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            top: ITEM_HEIGHT * 2,
            height: ITEM_HEIGHT,
          }}
        />
      </View>
      <GestureHandler
        max={values.length}
        translateY={translateY}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      />
    </View>
  );
};

export default Picker;
