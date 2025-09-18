import React from "react";
import { View, TouchableOpacity, Animated, Dimensions, StyleSheet, Platform } from "react-native";
import { Tooltip } from "react-native-paper";
import { useTheme } from "@/contexts/ThemeContext";
import { BlurView } from "expo-blur";
import HomeIcon from "@/components/icons/tab-icons/HomeIcon";
import ExploreIcon from "@/components/icons/tab-icons/ExploreIcon";
import BookingsIcon from "@/components/icons/tab-icons/BookingsIcon";
import SettingsIcon from "@/components/icons/tab-icons/SettingsIcon";
// import { Canvas, BackdropBlur, Fill } from "@shopify/react-native-skia";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const { isDark } = useTheme();
  const animatedValues = React.useRef(state.routes.map(() => new Animated.Value(0))).current;

  const animateTab = (index: number, focused: boolean) => {
    Animated.spring(animatedValues[index], {
      toValue: focused ? -5 : 5,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  React.useEffect(() => {
    state.routes.forEach((route: any, index: number) => {
      const isFocused = state.index === index;
      animateTab(index, isFocused);
    });
  }, [state.index]);

  const renderIcon = (routeName: string, isFocused: boolean) => {
    const iconProps = { isFocused, width: 24, height: 24 };
    switch (routeName) {
      case "Home":
      case "index":
        return <HomeIcon {...iconProps} />;
      case "Explore":
      case "explore":
        return <ExploreIcon {...iconProps} />;
      case "Bookings":
      case "bookings":
        return <BookingsIcon {...iconProps} />;
      case "Settings":
      case "settings":
        return <SettingsIcon {...iconProps} />;
      default:
        return <HomeIcon {...iconProps} />;
    }
  };

  const getTooltipText = (routeName: string) => {
    switch (routeName) {
      case "Home":
      case "index":
        return "Home";
      case "Explore":
      case "explore":
        return "Explore";
      case "Bookings":
      case "bookings":
        return "Bookings";
      case "Settings":
      case "settings":
        return "Settings";
      default:
        return routeName;
    }
  };

  // const insets = useSafeAreaInsets();

  // Calculate tab bar height (padding + content + safe area)
  // const tabBarHeight = 70 + insets.bottom; // Adjust based on your actual tab bar height

  return (
    <View
      className={
        Platform.OS === "android"
          ? "flex-row border-t border-border bg-card"
          : "flex-row border-t border-border"
      }
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        },
        Platform.select({
          ios: { backgroundColor: "transparent" },
          android: undefined,
          default: undefined,
        }),
      ]}
    >
      {Platform.OS === "ios" && (
        <View style={StyleSheet.absoluteFill}>
          <BlurView
            intensity={80}
            tint={isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
            // experimentalBlurMethod="dimezisBlurView"
          />
          <View style={StyleSheet.absoluteFill} pointerEvents="none" />
        </View>
      )}

      {/* <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1000 }}> */}

      {/* Backdrop Blur Canvas - positioned to capture screen content behind */}
      {/* <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: screenWidth,
          height: tabBarHeight,
        }}
      >
        <BackdropBlur blur={2} clip={{ x: 0, y: 0, width: screenWidth, height: tabBarHeight }}>
          <Fill color="rgba(0, 0, 0, .9)" />
        </BackdropBlur>
      </Canvas> */}

      {/* Tab Bar Content */}
      {/* <View
        className="flex-row border-t border-border"
        style={{
          backgroundColor: "transparent",
          paddingBottom: insets.bottom,
        }}
      > */}
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label: string =
          (typeof options.tabBarLabel === "string" && options.tabBarLabel) ||
          (typeof options.title === "string" && options.title) ||
          route.name;

        const onPress = () => {
          (global as any).hapticClick();

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View
            key={route.key}
            style={{
              flex: 1,
              paddingVertical: 15,
              paddingBottom: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tooltip title={label} enterTouchDelay={500} leaveTouchDelay={1000}>
              <TouchableOpacity
                onPress={onPress}
                // className="flex-1 items-center justify-center py-2"
                activeOpacity={1}
              >
                <Animated.View
                  className="items-center justify-center"
                  style={{
                    transform: [{ translateY: animatedValues[index] }],
                  }}
                >
                  {renderIcon(route.name, isFocused)}
                </Animated.View>
                <Animated.Text
                  className="text-center text-xs font-medium text-foreground"
                  style={{
                    opacity: animatedValues[index].interpolate({
                      inputRange: [-5, 0],
                      outputRange: [1, 0],
                    }),
                    transform: [{ translateY: 4 }],
                  }}
                >
                  {label}
                </Animated.Text>
              </TouchableOpacity>
            </Tooltip>
          </View>
        );
      })}
      {/* </View> */}
    </View>
  );
};

export default TabBar;
