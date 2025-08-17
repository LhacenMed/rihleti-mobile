import "./global.css";
import { StatusBar } from "expo-status-bar";
import Home from "./app/tabs/Index";
import Explore from "app/tabs/Explore";
import Bookings from "app/tabs/Bookings";
import Settings from "app/tabs/Settings";
import Account from "./app/screens/Account";
import { Ionicons } from "@expo/vector-icons";
import CustomTabBar from "./components/TabBar";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="MainTabs" component={MyTab} />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const MyTab = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarStyle: { position: "relative", paddingBottom: 15 },
        tabBarActiveTintColor: "black",
        tabBarLabelStyle: { fontSize: 20 },
        tabBarShowIcon: true,
        tabBarShowLabel: false,
        tabBarIndicatorStyle: { display: "none" },
        tabBarPressColor: "transparent",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="call" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="call" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
