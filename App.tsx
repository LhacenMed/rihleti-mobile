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
import { AuthProvider, useAuth } from "@contexts/AuthContext";
import LoadingScreen from "@components/LoadingScreen";

// Auth Screens
import WelcomeScreen from "@screens/auth/WelcomeScreen";
import LoginScreen from "@screens/auth/LoginScreen";
import SignupScreen from "@screens/auth/SignupScreen";
import VerifyOTPScreen from "@screens/auth/VerifyOTPScreen";

// App Screens
import Home from "@screens/tabs/Index";
import Explore from "@screens/tabs/Explore";
import Bookings from "@screens/tabs/Bookings";
import Settings from "@screens/tabs/Settings";
import Account from "@screens/screens/Account";
import CustomTabBar from "@components/TabBar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  MainTabs: undefined;
  Account: undefined;
};

const Tab = createMaterialTopTabNavigator();
const RootStack = createStackNavigator<RootStackParamList>();

// Main Navigation Component
const AppNavigator = () => {
  const { user, loading } = useAuth();

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
              name="MainTabs"
              component={MyTab}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <RootStack.Screen
              name="Account"
              component={Account}
              options={{
                headerShown: false,
                ...TransitionPresets.ModalPresentationIOS,
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
                ...TransitionPresets.ModalPresentationIOS,
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

// Main App Component
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <StatusBar style="auto" />
          <AuthProvider>
            <AppNavigator />
            <Toast />
          </AuthProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
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
