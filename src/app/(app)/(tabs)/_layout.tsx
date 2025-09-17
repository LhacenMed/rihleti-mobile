import { Tabs } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useFeatures } from "@/contexts/FeaturesContext";

// Import your custom tab icons
import HomeIcon from "@/components/icons/tab-icons/HomeIcon";
import ExploreIcon from "@/components/icons/tab-icons/ExploreIcon";
import BookingsIcon from "@/components/icons/tab-icons/BookingsIcon";
import SettingsIcon from "@/components/icons/tab-icons/SettingsIcon";

// import { withLayoutContext } from "expo-router";
// import {
//   createNativeBottomTabNavigator,
//   NativeBottomTabNavigationOptions,
//   NativeBottomTabNavigationEventMap,
// } from "@bottom-tabs/react-navigation";
// import { ParamListBase, TabNavigationState } from "@react-navigation/native";

// const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

// const Tabs = withLayoutContext<
//   NativeBottomTabNavigationOptions,
//   typeof BottomTabNavigator,
//   TabNavigationState<ParamListBase>,
//   NativeBottomTabNavigationEventMap
// >(BottomTabNavigator);

// Header right component
function HeaderRight() {
  const { isDark } = useTheme();

  return (
    <View className="mr-4 flex-row items-center space-x-3">
      <TouchableOpacity className="p-2">
        <Ionicons name="search" size={22} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>
      <TouchableOpacity className="p-2">
        <Ionicons name="ellipsis-vertical" size={22} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const { isDark } = useTheme();
  const { swipeEnabled } = useFeatures();

  return (
    <Tabs
      // disablePageAnimations
      // tabBarStyle={{ backgroundColor: isDark ? "hsl(0 0% 4%)" : "hsl(0 0% 100%)", }}
      // tabBarActiveTintColor={isDark ? "#fff" : "#000"}
      // tabBarInactiveTintColor={isDark ? "#666" : "#999"}
      screenOptions={
        {
          headerShown: false,
          // headerStyle: {
          //   backgroundColor: isDark ? "hsl(0 0% 4%)" : "hsl(0 0% 100%)",
          //   elevation: 0,
          //   shadowOpacity: 0,
          //   borderBottomWidth: 1,
          //   borderBottomColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
          //   height: 90,
          // },
          // headerTitleStyle: {
          //   fontWeight: "bold",
          //   fontSize: 20,
          //   color: isDark ? "#fff" : "#000",
          // },
          // headerLeft: () => null,
          // headerRight: () => <HeaderRight />,
          tabBarStyle: {
            position: "relative",
            backgroundColor: isDark ? "hsl(0 0% 4%)" : "hsl(0 0% 100%)",
            borderTopColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
            borderTopWidth: 1,
            paddingVertical: 10,
          },
          tabBarActiveTintColor: isDark ? "#fff" : "#000",
          tabBarInactiveTintColor: isDark ? "#666" : "#999",
          tabBarShowLabel: false,
          // tabBarPressColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
        }
      }
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Home",
          tabBarIcon: ({ focused }) => (
            <HomeIcon isFocused={focused} width={24} height={24} />
          ),
          // tabBarIcon: () => ({ sfSymbol: "house" }),
          // tabBarIcon: ({ focused }) =>
          //   focused
          //     ? require("@/assets/icons/tab-icons/dark/home.png")
          //     : require("@/assets/icons/tab-icons/dark/home-outlined.png"),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerTitle: "Explore",
          tabBarIcon: ({ focused }) => (
            <ExploreIcon isFocused={focused} width={24} height={24} />
          ),
          // tabBarIcon: () => ({ sfSymbol: "house" }),
          // tabBarIcon: ({ focused }) =>
          //   focused
          //     ? require("@/assets/icons/tab-icons/dark/explore.png")
          //     : require("@/assets/icons/tab-icons/dark/explore-outlined.png"),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          headerTitle: "Bookings",
          tabBarIcon: ({ focused }) => (
            <BookingsIcon isFocused={focused} width={24} height={24} />
          ),
          // tabBarIcon: () => ({ sfSymbol: "house" }),
          // tabBarIcon: ({ focused }) =>
          //   focused
          //     ? require("@/assets/icons/tab-icons/dark/bookings.png")
          //     : require("@/assets/icons/tab-icons/dark/bookings-outlined.png"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitle: "Settings",
          tabBarIcon: ({ focused }) => (
            <SettingsIcon isFocused={focused} width={24} height={24} />
          ),
          // tabBarIcon: () => ({ sfSymbol: "house" }),
          // tabBarIcon: ({ focused }) =>
          //   focused
          //     ? require("@/assets/icons/tab-icons/dark/settings.png")
          //     : require("@/assets/icons/tab-icons/dark/settings-outlined.png"),
        }}
      />
    </Tabs>
  );
}
