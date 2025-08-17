import React from "react";
import {
  View,
  // Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TabBarProps {
  state: any;
  // descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<TabBarProps> = ({
  state,
  // descriptors,
  navigation,
}) => {
  const animatedValues = React.useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;

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
    <View style={styles.container}>
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
          route.name === "Home"
            ? "home"
            : route.name === "Settings"
            ? "settings"
            : "call";

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={1}
          >
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [{ translateY: animatedValues[index] }],
                },
              ]}
            >
              <Ionicons
                name={iconName as any}
                size={24}
                color={isFocused ? "#000" : "#666"}
              />
            </Animated.View>

            <Animated.Text
              style={[
                styles.label,
                {
                  opacity: animatedValues[index].interpolate({
                    inputRange: [-8, 0],
                    outputRange: [1, 0],
                  }),
                },
              ]}
            >
              {route.name}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingBottom: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default CustomTabBar;
