import React from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { Tooltip } from "react-native-paper";
// import { useTheme } from "@/contexts/ThemeContext";
import HomeIcon from "@/components/icons/tab-icons/HomeIcon";
import ExploreIcon from "@/components/icons/tab-icons/ExploreIcon";
import BookingsIcon from "@/components/icons/tab-icons/BookingsIcon";
import SettingsIcon from "@/components/icons/tab-icons/SettingsIcon";

interface TabBarProps {
  state: any;
  // descriptors: any;
  navigation: any;
}

const TabBar: React.FC<TabBarProps> = ({
  state,
  // descriptors,
  navigation,
}) => {
  // const { isDark } = useTheme();
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
        return <HomeIcon {...iconProps} />;
      case "Explore":
        return <ExploreIcon {...iconProps} />;
      case "Bookings":
        return <BookingsIcon {...iconProps} />;
      case "Settings":
        return <SettingsIcon {...iconProps} />;
      default:
        return <HomeIcon {...iconProps} />;
    }
  };

  const getTooltipText = (routeName: string) => {
    switch (routeName) {
      case "Home":
        return "Home";
      case "Explore":
        return "Explore";
      case "Bookings":
        return "Bookings";
      case "Settings":
        return "Settings";
      default:
        return routeName;
    }
  };

  return (
    <View className="flex-row border-t border-border bg-card">
      {state.routes.map((route: any, index: number) => {
        // const { options } = descriptors[route.key];
        const isFocused = state.index === index;

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
            style={{ flex: 1, paddingVertical: 15, alignItems: "center", justifyContent: "center" }}
          >
            <Tooltip
              title={getTooltipText(route.name)}
              enterTouchDelay={500}
              leaveTouchDelay={1000}
            >
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
                  {route.name}
                </Animated.Text>
              </TouchableOpacity>
            </Tooltip>
          </View>
        );
      })}
    </View>
  );
};

export default TabBar;
