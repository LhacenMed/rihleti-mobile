import "./global.css";
import { View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// Auth Context and Components
import { AuthProvider, useAuth } from "@contexts/AuthContext";
import LoadingScreen from "@components/LoadingScreen";

// Auth Screens
import WelcomeScreen from "@app/auth/WelcomeScreen";
import LoginScreen from "@app/auth/LoginScreen";
import SignupScreen from "@app/auth/SignupScreen";
import VerifyOTPScreen from "@app/auth/VerifyOTPScreen";

// App Screens
import Home from "@app/tabs/Index";
import Explore from "@app/tabs/Explore";
import Bookings from "@app/tabs/Bookings";
import Settings from "@app/tabs/Settings";
import Account from "@app/screens/Account";
import SettingsTest from "@app/screens/SettingsTest";
import TabBar from "@components/TabBar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ModalPresenterParent } from "@whitespectre/rn-modal-presenter";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Theme Context
import { ThemeProvider, useTheme } from "@contexts/ThemeContext";

type RootStackParamList = {
  // Auth Screens
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  VerifyOTP: {
    email: string;
    name: string;
  };
  // App Screens
  MainApp: undefined;
  Account: undefined;
  SettingsTest: undefined;
};

const Tab = createMaterialTopTabNavigator();
const RootStack = createStackNavigator<RootStackParamList>();

// Material Top Tabs Navigator (nested inside Stack)
const TopTabsNavigator = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      initialRouteName="Home"
      // comment if you want to use the default tab bar
      tabBar={(props) => <TabBar {...props} />}
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
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarLabel: "Explore",
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        options={{
          tabBarLabel: "Bookings",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigation Component
const AppNavigator = () => {
  const { user, loading } = useAuth();
  const { isDark } = useTheme();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          // Authenticated screens
          <>
            <RootStack.Screen
              name="MainApp"
              component={TopTabsNavigator}
              options={({ route }: any) => {
                // Get the focused route name from the nested tab navigator
                const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

                return {
                  headerShown: true,
                  headerTitle: routeName,
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 20,
                    color: isDark ? "#ffffff" : "#000000",
                  },
                  headerStyle: {
                    backgroundColor: isDark ? "#000" : "#fff",
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
                  },
                  headerRight: () => (
                    <View className="mr-4 flex-row items-center space-x-3">
                      <TouchableOpacity className="p-2">
                        <Ionicons name="search" size={24} color={isDark ? "#ffffff" : "#000000"} />
                      </TouchableOpacity>
                      <TouchableOpacity className="p-2">
                        <Ionicons
                          name="ellipsis-vertical"
                          size={24}
                          color={isDark ? "#ffffff" : "#000000"}
                        />
                      </TouchableOpacity>
                    </View>
                  ),
                  ...TransitionPresets.SlideFromRightIOS,
                };
              }}
            />
            <RootStack.Screen
              name="Account"
              component={Account}
              options={{
                headerShown: true,
                headerTitle: "Account",
                headerTitleStyle: {
                  fontWeight: "bold",
                  fontSize: 20,
                  color: isDark ? "#ffffff" : "#000000",
                },
                headerStyle: {
                  backgroundColor: isDark ? "#000" : "#fff",
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
                },
                ...TransitionPresets.ModalPresentationIOS,
              }}
            />
            <RootStack.Screen
              name="SettingsTest"
              component={SettingsTest}
              options={{
                headerShown: true,
                headerTitle: "Settings",
                headerTitleStyle: {
                  fontWeight: "bold",
                  fontSize: 20,
                  color: isDark ? "#ffffff" : "#000000",
                },
                headerStyle: {
                  backgroundColor: isDark ? "#000" : "#fff",
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
                },
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
          </>
        ) : (
          // Unauthenticated screens
          <>
            <RootStack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{
                headerShown: false,
                ...TransitionPresets.ModalSlideFromBottomIOS,
              }}
            />
            <RootStack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            {/* <RootStack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
                presentation: "modal",
                gestureEnabled: true,
                gestureDirection: "vertical",
                cardStyleInterpolator: ({ current, next, layouts }) => {
                  const modalHeight = layouts.screen.height * 0.9; // Modal takes 90% of screen
                  const topOffset = layouts.screen.height * 0.06; // 10% visible background

                  const translateY = current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.height, topOffset],
                    extrapolate: "clamp",
                  });

                  // Background screen moves up slightly
                  const backgroundTranslateY = next
                    ? next.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -40], // Move background up by 20px
                        extrapolate: "clamp",
                      })
                    : 0;

                  const backgroundScale = next
                    ? next.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.95],
                        extrapolate: "clamp",
                      })
                    : 1;

                  return {
                    cardStyle: {
                      height: modalHeight,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      overflow: "hidden",
                      transform: [{ translateY }],
                    },
                    overlayStyle: {
                      opacity: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.3],
                      }),
                      backgroundColor: "black",
                    },
                    // This affects the previous screen
                    ...(next && {
                      containerStyle: {
                        transform: [
                          { translateY: backgroundTranslateY },
                          { scale: backgroundScale },
                        ],
                      },
                    }),
                  };
                },
                cardOverlayEnabled: true,
                gestureResponseDistance: 100,
              }}
            /> */}
            <RootStack.Screen
              name="SignUp"
              component={SignupScreen}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <RootStack.Screen
              name="VerifyOTP"
              component={VerifyOTPScreen}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <ModalPresenterParent>
              <BottomSheetModalProvider>
                <AppNavigator />
                <Toast />
              </BottomSheetModalProvider>
            </ModalPresenterParent>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
