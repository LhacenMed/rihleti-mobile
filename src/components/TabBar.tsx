import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@contexts/ThemeContext";

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
  const { isDark } = useTheme();
  const animatedValues = React.useRef(state.routes.map(() => new Animated.Value(0))).current;

  const animateTab = (index: number, focused: boolean) => {
    Animated.spring(animatedValues[index], {
      toValue: focused ? -8 : 0,
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

  return (
    <View className="flex-row border-t border-border bg-background pb-2.5 pt-2.5">
      {state.routes.map((route: any, index: number) => {
        // const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName =
          route.name === "Home" ? "home" : route.name === "Settings" ? "settings" : "call";

        const iconColor = isFocused
          ? isDark
            ? "#ffffff"
            : "#000000"
          : isDark
            ? "#9ca3af"
            : "#6b7280";

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center justify-center py-2"
            activeOpacity={1}
          >
            <Animated.View
              className="items-center justify-center"
              style={{
                transform: [{ translateY: animatedValues[index] }],
              }}
            >
              <Ionicons name={iconName as any} size={24} color={iconColor} />
            </Animated.View>

            <Animated.Text
              className="text-center text-xs font-medium text-foreground"
              style={{
                opacity: animatedValues[index].interpolate({
                  inputRange: [-8, 0],
                  outputRange: [1, 0],
                }),
              }}
            >
              {route.name}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
