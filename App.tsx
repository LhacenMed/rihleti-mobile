import "./global.css";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

// Auth Context and Components
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoadingScreen from "./components/LoadingScreen";

// Auth Screens
import WelcomeScreen from "./app/auth/WelcomeScreen";
import LoginScreen from "./app/auth/LoginScreen";
import SignupScreen from "./app/auth/SignupScreen";
import VerifyOTPScreen from "./app/auth/VerifyOTPScreen";

// App Screens
import Home from "./app/tabs/Index";
import Explore from "app/tabs/Explore";
import Bookings from "app/tabs/Bookings";
import Settings from "app/tabs/Settings";
import Account from "./app/screens/Account";
import CustomTabBar from "./components/TabBar";

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  VerifyOTP: {
    email: string;
    name: string;
  };
};

type AppStackParamList = {
  MainTabs: undefined;
  Account: undefined;
};

const Tab = createMaterialTopTabNavigator();
const AuthStack = createStackNavigator<AuthStackParamList>();
const AppStackNavigator = createStackNavigator<AppStackParamList>();

// Auth Stack for unauthenticated users
const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Welcome"
    >
      <AuthStack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <AuthStack.Screen
        name="VerifyOTP"
        component={VerifyOTPScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </AuthStack.Navigator>
  );
};

// App Stack for authenticated users
const AppStack = () => {
  return (
    <AppStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStackNavigator.Screen name="MainTabs" component={MyTab} />
      <AppStackNavigator.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </AppStackNavigator.Navigator>
  );
};

// Protected Navigation Component
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return <NavigationContainer>{user ? <AppStack /> : <AuthStackScreen />}</NavigationContainer>;
};

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AuthProvider>
        <AppNavigator />
        <Toast />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const MyTab = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      initialRouteName="Home"
      // comment if you want to use the default tab bar
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarStyle: { position: "relative", paddingBottom: 15 },
        tabBarActiveTintColor: "black",
        tabBarLabelStyle: { fontSize: 20 },
        tabBarShowIcon: true,
        tabBarShowLabel: false,
        tabBarIndicatorStyle: { display: "none" },
        tabBarPressColor: "transparent",
        swipeEnabled: true, // Keep swipe animation enabled
        animationEnabled: false, // Make swipe animation disabled when pressing a tab
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
