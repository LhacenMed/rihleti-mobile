// Global styles and utilities
import "./global.css";
import "@/utils/haptic"; // Initialize global haptic function

// React and React Native core
import { View, TouchableOpacity } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";

// Expo
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { Ionicons } from "@expo/vector-icons";
import HomeIcon from "@/components/icons/tab-icons/HomeIcon";
import ExploreIcon from "@/components/icons/tab-icons/ExploreIcon";
import BookingsIcon from "@/components/icons/tab-icons/BookingsIcon";
import SettingsIcon from "@/components/icons/tab-icons/SettingsIcon";

// React Navigation
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// Third-party libraries
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ModalPresenterParent } from "@whitespectre/rn-modal-presenter";

// Components
import TabBar from "@/components/TabBar";
import { toastConfig } from "@/components/ui/toast";

// Contexts
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { FeaturesProvider, useFeatures } from "@/contexts/FeaturesContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

// Hooks
import { useAppReady } from "@/hooks/useAppReady";

// Auth Screens
import LoginScreen from "@/app/auth/LoginScreen";
import SignupScreen from "@/app/auth/SignupScreen";
import VerifyOTPScreen from "@/app/auth/VerifyOTPScreen";
import WelcomeScreen from "@/app/auth/WelcomeScreen";

// App Screens
import Account from "@/app/screens/Account";
import DepartureLocationScreen from "@/app/screens/DepartureLocation";
import DestinationLocationScreen from "@/app/screens/DestinationLocation";
import Messages from "@/app/screens/Messages";
import Preferences from "@/app/screens/Preferences";
import SettingsTest from "@/app/screens/SettingsTest";
import TripDetailsScreen from "@/app/screens/TripDetails";
import TripsScreen from "@/app/screens/Trips";
import WebViewScreen from "@/app/screens/WebView";

// Tab Screens
import Bookings from "@/app/tabs/Bookings";
import Explore from "@/app/tabs/Explore";
import Home from "@/app/tabs/Home";
import Settings from "@/app/tabs/Settings";
import { useAnimatedKeyboard } from "react-native-reanimated";
import React from "react";

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
  WebView: {
    link: string;
    title?: string;
  };
  Messages: undefined;
  Preferences: undefined;
  DepartureLocation: undefined;
  DestinationLocation: undefined;
  Trips: {
    departure: string;
    destination: string;
  };
  TripDetails: {
    tripId: string;
  };
};

const Tab = createMaterialTopTabNavigator();
const RootStack = createStackNavigator<RootStackParamList>();

// Material Top Tabs Navigator
const TopTabsNavigator = () => {
  const { swipeEnabled } = useFeatures();
  const { isDark } = useTheme();
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      initialRouteName="Home"
      // comment if you want to use the default tab bar
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarStyle: {
          position: "relative",
          backgroundColor: isDark ? "hsl(0 0% 4%)" : "hsl(0 0% 100%)",
          borderTopColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
          borderTopWidth: 1,
          paddingVertical: 10,
        },
        tabBarActiveTintColor: "black",
        // tabBarLabelStyle: { fontSize: 20 },
        tabBarShowIcon: true,
        tabBarShowLabel: false,
        tabBarIndicatorStyle: { display: "none" },
        tabBarPressColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
        swipeEnabled, // Controlled by FeaturesContext
        animationEnabled: false, // Make swipe animation disabled when pressing a tab button
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => <HomeIcon isFocused={focused} width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ focused }) => <ExploreIcon isFocused={focused} width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        options={{
          tabBarLabel: "Bookings",
          tabBarIcon: ({ focused }) => <BookingsIcon isFocused={focused} width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }) => <SettingsIcon isFocused={focused} width={24} height={24} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Create header right component to avoid hook call in options
const HeaderRight = () => {
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
};

// Screen configurations
const getAuthenticatedScreens = (isDark: Boolean) => {
  // const { isDark } = useTheme();

  return [
    <RootStack.Screen
      key="MainApp"
      name="MainApp"
      component={TopTabsNavigator}
      options={({ route }: any) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
        return {
          headerShown: true,
          headerTitle: routeName,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
            color: isDark ? "#fff" : "#000",
          },
          headerStyle: {
            backgroundColor: isDark ? "hsl(0 0% 4%)" : "hsl(0 0% 100%)",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
            height: 90,
          },
          headerRight: () => <HeaderRight />,
          ...TransitionPresets.SlideFromRightIOS,
        };
      }}
    />,
    <RootStack.Screen
      key="Account"
      name="Account"
      component={Account}
      options={{
        headerShown: false,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    />,
    <RootStack.Screen
      key="Preferences"
      name="Preferences"
      component={Preferences}
      options={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />,
    <RootStack.Screen
      key="Messages"
      name="Messages"
      component={Messages}
      options={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />,
    <RootStack.Screen
      key="DepartureLocation"
      name="DepartureLocation"
      component={DepartureLocationScreen}
      options={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />,
    <RootStack.Screen
      key="DestinationLocation"
      name="DestinationLocation"
      component={DestinationLocationScreen}
      options={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />,
    <RootStack.Screen
      key="Trips"
      name="Trips"
      component={TripsScreen}
      options={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />,
    <RootStack.Screen
      key="TripDetails"
      name="TripDetails"
      component={TripDetailsScreen}
      options={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />,
  ];
};

const getUnauthenticatedScreens = (isDark: Boolean) => [
  <RootStack.Screen
    key="Welcome"
    name="Welcome"
    component={WelcomeScreen}
    options={{
      headerShown: false,
      ...TransitionPresets.ModalSlideFromBottomIOS,
    }}
  />,
  <RootStack.Screen
    key="Login"
    name="Login"
    component={LoginScreen}
    options={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS,
    }}
  />,
  <RootStack.Screen
    key="SignUp"
    name="SignUp"
    component={SignupScreen}
    options={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS,
    }}
  />,
  <RootStack.Screen
    key="VerifyOTP"
    name="VerifyOTP"
    component={VerifyOTPScreen}
    options={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS,
    }}
  />,
];

const getSharedScreens = (isDark: Boolean) => [
  <RootStack.Screen
    key="SettingsTest"
    name="SettingsTest"
    component={SettingsTest}
    options={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS,
    }}
  />,
  <RootStack.Screen
    key="WebView"
    name="WebView"
    component={WebViewScreen}
    options={{
      headerShown: false,
      ...TransitionPresets.ModalPresentationIOS,
    }}
  />,
];

// Main Navigation Component
const AppNavigator = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const keyboard = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  });

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated user screens
          <>
            {getAuthenticatedScreens(isDark)}
            {getSharedScreens(isDark)}
          </>
        ) : (
          // Unauthenticated user screens
          <>
            {getUnauthenticatedScreens(isDark)}
            {getSharedScreens(isDark)}
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

// App Initialization Component
const AppContent = () => {
  const { isReady } = useAppReady();

  // TODO: Implement an animated splash screen

  // Don't render anything until app is ready
  if (!isReady) {
    return null;
  }

  return <AppNavigator />;
};

export default function App() {
  // React.useEffect(() => {
  //   changeNavigationBarColor("#1e1e1e", true); // true = light icons
  // }, []);
  // React.useEffect(() => {
  //   SystemUI.setBackgroundColorAsync("#1e1e1e");
  // }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <FeaturesProvider>
            <AuthProvider>
              <PaperProvider>
                <ModalPresenterParent>
                  <BottomSheetModalProvider>
                    <StatusBar style="auto" translucent />
                    <AppContent />
                    <Toast
                      config={toastConfig}
                      position="top"
                      topOffset={60}
                      visibilityTime={4000}
                      autoHide={true}
                      swipeable={true}
                    />
                  </BottomSheetModalProvider>
                </ModalPresenterParent>
              </PaperProvider>
            </AuthProvider>
          </FeaturesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
