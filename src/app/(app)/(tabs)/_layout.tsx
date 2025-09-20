import { withLayoutContext } from "expo-router";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useFeatures } from "@/contexts/FeaturesContext";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TabBar from "@/components/TabBar";

// Import screens from this folder
import Home from "./index";
import Explore from "./explore";
import Bookings from "./bookings";
import Settings from "./settings";

// Import your custom tab icons
import HomeIcon from "@/components/icons/tab-icons/HomeIcon";
import ExploreIcon from "@/components/icons/tab-icons/ExploreIcon";
import BookingsIcon from "@/components/icons/tab-icons/BookingsIcon";
import SettingsIcon from "@/components/icons/tab-icons/SettingsIcon";

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

// Set up Top Tabs wrapped for Expo Router
const TopTabs = createMaterialTopTabNavigator();
const Tabs = withLayoutContext(TopTabs.Navigator);

export default function TabLayout() {
  const { isDark } = useTheme();
  const { swipeEnabled } = useFeatures();

  return (
    <Tabs
      tabBarPosition="bottom"
      initialRouteName="index"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarStyle: {
          position: "relative",
          backgroundColor: isDark ? "hsl(0 0% 4%)" : "hsl(0 0% 100%)",
          borderTopColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
          borderTopWidth: 1,
          paddingVertical: 10,
        },
        tabBarActiveTintColor: isDark ? "#fff" : "#000",
        tabBarShowIcon: true,
        tabBarShowLabel: false,
        tabBarIndicatorStyle: { display: "none" },
        tabBarPressColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
        swipeEnabled,
        animationEnabled: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <HomeIcon isFocused={focused} width={24} height={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <ExploreIcon isFocused={focused} width={24} height={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarLabel: "Bookings",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <BookingsIcon isFocused={focused} width={24} height={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <SettingsIcon isFocused={focused} width={24} height={24} />
          ),
        }}
      />
    </Tabs>
  );
}
