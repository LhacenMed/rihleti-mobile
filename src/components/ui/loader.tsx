import React, { useEffect } from "react";
import { View, Text, AppState } from "react-native";
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

export const LoaderOne = () => {
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
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d4d4d4",
    borderWidth: 0.5,
    borderColor: "#a3a3a3",
    marginHorizontal: 1,
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Animated.View style={[dotStyle, animatedStyle1]} />
      <Animated.View style={[dotStyle, animatedStyle2]} />
      <Animated.View style={[dotStyle, animatedStyle3]} />
    </View>
  );
};

export const LoaderTwo = () => {
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
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Animated.View style={[circleStyle, animatedStyle1]} />
      <Animated.View style={[circleStyle, { marginLeft: -8 }, animatedStyle2]} />
      <Animated.View style={[circleStyle, { marginLeft: -8 }, animatedStyle3]} />
    </View>
  );
};

export const LoaderThree = () => {
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
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width="80" height="80" viewBox="0 0 24 24">
        <Path
          d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"
          stroke="#737373"
          strokeWidth="1"
          fill="transparent"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <AnimatedPath
          d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"
          stroke="none"
          fill="#fbbf24"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

export const LoaderFour = ({ text = "Loading..." }: { text?: string }) => {
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

  return (
    <View style={{ position: "relative" }}>
      <Animated.Text
        style={[
          {
            fontSize: 16,
            fontWeight: "bold",
            color: "#000",
            zIndex: 20,
          },
          mainTextStyle,
        ]}
      >
        {text}
      </Animated.Text>
      <Animated.Text
        style={[
          {
            position: "absolute",
            fontSize: 16,
            fontWeight: "bold",
            color: "#00e571",
            zIndex: 10,
          },
          greenTextStyle,
        ]}
      >
        {text}
      </Animated.Text>
      <Animated.Text
        style={[
          {
            position: "absolute",
            fontSize: 16,
            fontWeight: "bold",
            color: "#8b00ff",
            zIndex: 5,
          },
          purpleTextStyle,
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

export const LoaderFive = ({ text }: { text: string }) => {
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

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {chars.map((char, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: animatedValues[index].scale.value }],
          opacity: animatedValues[index].opacity.value,
        }));

        return (
          <Animated.Text
            key={index}
            style={[
              {
                fontSize: 16,
                fontWeight: "bold",
                color: "#fff",
              },
              animatedStyle,
            ]}
          >
            {char === " " ? "\u00A0" : char}
          </Animated.Text>
        );
      })}
    </View>
  );
};
