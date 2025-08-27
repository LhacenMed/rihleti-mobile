import React, { useEffect } from "react";
import { View, Text, AppState, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
  cancelAnimation,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface LoaderOneProps {
  style?: ViewStyle;
  dotColor?: string;
  // dotBorderColor?: string;
  dotSize?: number;
}

export const LoaderOne = ({
  style,
  dotColor = "#d4d4d4",
  // dotBorderColor = "#a3a3a3",
  dotSize = 4,
}: LoaderOneProps) => {
  const translateY1 = useSharedValue(0);
  const translateY2 = useSharedValue(0);
  const translateY3 = useSharedValue(0);

  useEffect(() => {
    const animateDot = (sharedValue: Animated.SharedValue<number>, delay: number) => {
      sharedValue.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(5, { duration: 500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        )
      );
    };

    animateDot(translateY1, 0);
    animateDot(translateY2, 200);
    animateDot(translateY3, 400);
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY2.value }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY3.value }],
  }));

  const dotStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: dotColor,
    // borderWidth: 0.5,
    // borderColor: dotBorderColor,
    marginHorizontal: 2,
  };

  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      <Animated.View style={[dotStyle, animatedStyle1]} />
      <Animated.View style={[dotStyle, animatedStyle2]} />
      <Animated.View style={[dotStyle, animatedStyle3]} />
    </View>
  );
};

interface LoaderTwoProps {
  style?: ViewStyle;
  circleColor?: string;
  circleSize?: number;
}

export const LoaderTwo = ({ style, circleColor = "#e5e5e5", circleSize = 16 }: LoaderTwoProps) => {
  const translateX1 = useSharedValue(0);
  const translateX2 = useSharedValue(0);
  const translateX3 = useSharedValue(0);

  useEffect(() => {
    const animateCircle = (sharedValue: Animated.SharedValue<number>, delay: number) => {
      sharedValue.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(20, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        )
      );
    };

    animateCircle(translateX1, 0);
    animateCircle(translateX2, 400);
    animateCircle(translateX3, 800);
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX2.value }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX3.value }],
  }));

  const circleStyle = {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: circleColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };

  const overlap = circleSize / 2;

  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      <Animated.View style={[circleStyle, animatedStyle1]} />
      <Animated.View style={[circleStyle, { marginLeft: -overlap }, animatedStyle2]} />
      <Animated.View style={[circleStyle, { marginLeft: -overlap }, animatedStyle3]} />
    </View>
  );
};

interface LoaderThreeProps {
  style?: ViewStyle;
  size?: number;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
}

export const LoaderThree = ({
  style,
  size = 80,
  strokeColor = "#737373",
  fillColor = "#fbbf24",
  strokeWidth = 1,
}: LoaderThreeProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const fillOpacity = interpolate(progress.value, [0, 1], [0, 1]);

    return {
      fillOpacity,
    };
  });

  return (
    <View style={[{ alignItems: "center", justifyContent: "center" }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <AnimatedPath
          d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"
          stroke="none"
          fill={fillColor}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

interface LoaderFourProps {
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  glitchColor1?: string;
  glitchColor2?: string;
}

export const LoaderFour = ({
  text = "Loading...",
  style,
  textStyle,
  glitchColor1 = "#00e571",
  glitchColor2 = "#8b00ff",
}: LoaderFourProps) => {
  const skewX = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const glitchX = useSharedValue(0);
  const glitchY = useSharedValue(0);
  const glitchOpacity = useSharedValue(0.3);
  const purpleX = useSharedValue(0);
  const purpleY = useSharedValue(0);
  const purpleOpacity = useSharedValue(0.4);

  useEffect(() => {
    // Main text glitch effect
    const mainGlitch = () => {
      skewX.value = withSequence(
        withTiming(-0.5, { duration: 25, easing: Easing.linear }),
        withTiming(0, { duration: 25, easing: Easing.linear })
      );
      scaleX.value = withSequence(
        withTiming(2, { duration: 25, easing: Easing.linear }),
        withTiming(1, { duration: 25, easing: Easing.linear })
      );
    };

    // Green glitch effect
    const greenGlitch = () => {
      glitchX.value = withSequence(
        withTiming(-2, { duration: 100, easing: Easing.linear }),
        withTiming(4, { duration: 200, easing: Easing.linear }),
        withTiming(-3, { duration: 100, easing: Easing.linear }),
        withTiming(1.5, { duration: 100, easing: Easing.linear }),
        withTiming(-2, { duration: 100, easing: Easing.linear })
      );
      glitchY.value = withSequence(
        withTiming(-2, { duration: 100, easing: Easing.linear }),
        withTiming(4, { duration: 200, easing: Easing.linear }),
        withTiming(-3, { duration: 100, easing: Easing.linear }),
        withTiming(1.5, { duration: 100, easing: Easing.linear }),
        withTiming(-2, { duration: 100, easing: Easing.linear })
      );
      glitchOpacity.value = withSequence(
        withTiming(0.3, { duration: 100, easing: Easing.linear }),
        withTiming(0.9, { duration: 200, easing: Easing.linear }),
        withTiming(0.4, { duration: 100, easing: Easing.linear }),
        withTiming(0.8, { duration: 100, easing: Easing.linear }),
        withTiming(0.3, { duration: 100, easing: Easing.linear })
      );
    };

    // Purple glitch effect
    const purpleGlitch = () => {
      purpleX.value = withSequence(
        withTiming(0, { duration: 150, easing: Easing.linear }),
        withTiming(1, { duration: 150, easing: Easing.linear }),
        withTiming(-1.5, { duration: 200, easing: Easing.linear }),
        withTiming(1.5, { duration: 150, easing: Easing.linear }),
        withTiming(-1, { duration: 150, easing: Easing.linear }),
        withTiming(0, { duration: 100, easing: Easing.linear })
      );
      purpleY.value = withSequence(
        withTiming(0, { duration: 150, easing: Easing.linear }),
        withTiming(-1, { duration: 150, easing: Easing.linear }),
        withTiming(1.5, { duration: 200, easing: Easing.linear }),
        withTiming(-0.5, { duration: 150, easing: Easing.linear }),
        withTiming(0, { duration: 250, easing: Easing.linear })
      );
      purpleOpacity.value = withSequence(
        withTiming(0.4, { duration: 150, easing: Easing.linear }),
        withTiming(0.8, { duration: 150, easing: Easing.linear }),
        withTiming(0.3, { duration: 200, easing: Easing.linear }),
        withTiming(0.9, { duration: 150, easing: Easing.linear }),
        withTiming(0.4, { duration: 250, easing: Easing.linear })
      );
    };

    const startGlitchCycle = () => {
      mainGlitch();
      greenGlitch();
      purpleGlitch();

      // Repeat after delay
      setTimeout(() => {
        runOnJS(startGlitchCycle)();
      }, 2000);
    };

    startGlitchCycle();
  }, []);

  const mainTextStyle = useAnimatedStyle(() => ({
    transform: [
      {
        skewX: `${interpolate(skewX.value, [-1, 1], [-15, 15])}deg` as any,
      },
      { scaleX: scaleX.value },
    ],
  }));

  const greenTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: glitchX.value }, { translateY: glitchY.value }],
    opacity: glitchOpacity.value,
  }));

  const purpleTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: purpleX.value }, { translateY: purpleY.value }],
    opacity: purpleOpacity.value,
  }));

  const defaultTextStyle = {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: "#000",
  };

  return (
    <View style={[{ position: "relative" }, style]}>
      <Animated.Text style={[defaultTextStyle, { zIndex: 20 }, textStyle, mainTextStyle]}>
        {text}
      </Animated.Text>
      <Animated.Text
        style={[
          {
            position: "absolute",
            ...defaultTextStyle,
            color: glitchColor1,
            zIndex: 10,
          },
          textStyle,
          greenTextStyle,
        ]}
      >
        {text}
      </Animated.Text>
      <Animated.Text
        style={[
          {
            position: "absolute",
            ...defaultTextStyle,
            color: glitchColor2,
            zIndex: 5,
          },
          textStyle,
          purpleTextStyle,
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

interface LoaderFiveProps {
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const LoaderFive = ({ text, style, textStyle }: LoaderFiveProps) => {
  const chars = text.split("");
  const animatedValues = chars.map(() => ({
    scale: useSharedValue(1),
    opacity: useSharedValue(0.5),
  }));

  useEffect(() => {
    const animateChars = () => {
      animatedValues.forEach((animatedValue, index) => {
        animatedValue.scale.value = withDelay(
          index * 50,
          withSequence(
            withTiming(1.1, { duration: 250, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 250, easing: Easing.inOut(Easing.ease) })
          )
        );

        animatedValue.opacity.value = withDelay(
          index * 50,
          withSequence(
            withTiming(1, { duration: 250, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.5, { duration: 250, easing: Easing.inOut(Easing.ease) })
          )
        );
      });

      // Repeat after delay
      setTimeout(
        () => {
          runOnJS(animateChars)();
        },
        2000 + chars.length * 50
      );
    };

    animateChars();
  }, [text]);

  const defaultTextStyle = {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: "#fff",
  };

  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      {chars.map((char, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: animatedValues[index].scale.value }],
          opacity: animatedValues[index].opacity.value,
        }));

        return (
          <Animated.Text key={index} style={[defaultTextStyle, textStyle, animatedStyle]}>
            {char === " " ? "\u00A0" : char}
          </Animated.Text>
        );
      })}
    </View>
  );
};
