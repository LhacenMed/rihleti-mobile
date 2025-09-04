import "./global.css";
import "@/utils/haptic"; // Initialize global haptic function
import { View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ui/toast";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ModalPresenterParent } from "@whitespectre/rn-modal-presenter";

// Contexts
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { FeaturesProvider, useFeatures } from "@/contexts/FeaturesContext";

// Loading Hook
import { useAppReady } from "@/hooks/useAppReady";

// Auth Screens
import WelcomeScreen from "@/app/auth/WelcomeScreen";
import LoginScreen from "@/app/auth/LoginScreen";
import SignupScreen from "@/app/auth/SignupScreen";
import VerifyOTPScreen from "@/app/auth/VerifyOTPScreen";

// App Screens
import Home from "@/app/tabs/Home";
import Explore from "@/app/tabs/Explore";
import Bookings from "@/app/tabs/Bookings";
import Settings from "@/app/tabs/Settings";
import Account from "@/app/screens/Account";
import SettingsTest from "@/app/screens/SettingsTest";
import WebViewScreen from "@/app/screens/WebView";
import Messages from "@/app/screens/Messages";
import Preferences from "@/app/screens/Preferences";
import DepartureLocationScreen from "@/app/screens/DepartureLocation";
import DestinationLocationScreen from "@/app/screens/DestinationLocation";
import TripsScreen from "@/app/screens/Trips";
import TripDetailsScreen from "@/app/screens/TripDetails";
import TabBar from "@/components/TabBar";

// Utilities
// import { storeLoaderInSupabase, loadLoaderFromSupabase } from "@/components/ui/loader";

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
        swipeEnabled, // Controlled by FeaturesContext
        animationEnabled: false, // Make swipe animation disabled when pressing a tab button
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: "Home" }} />
      <Tab.Screen name="Explore" component={Explore} options={{ tabBarLabel: "Explore" }} />
      <Tab.Screen name="Bookings" component={Bookings} options={{ tabBarLabel: "Bookings" }} />
      <Tab.Screen name="Settings" component={Settings} options={{ tabBarLabel: "Settings" }} />
    </Tab.Navigator>
  );
};

// Main Navigation Component
const AppNavigator = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated screens
          <>
            {/* Main app screen */}
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
                    color: isDark ? "#fff" : "#000",
                  },
                  headerStyle: {
                    backgroundColor: isDark ? "#000" : "#fff",
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
                    height: 90,
                  },
                  headerRight: () => (
                    <View className="mr-4 flex-row items-center space-x-3">
                      <TouchableOpacity className="p-2">
                        <Ionicons name="search" size={22} color={isDark ? "#fff" : "#000"} />
                      </TouchableOpacity>
                      <TouchableOpacity className="p-2">
                        <Ionicons
                          name="ellipsis-vertical"
                          size={22}
                          color={isDark ? "#fff" : "#000"}
                        />
                      </TouchableOpacity>
                    </View>
                  ),
                  ...TransitionPresets.SlideFromRightIOS,
                };
              }}
            />
            {/* Other app screens */}
            <RootStack.Screen
              name="Account"
              component={Account}
              options={{
                headerShown: false,
                ...TransitionPresets.ModalPresentationIOS,
              }}
            />
            <RootStack.Screen
              name="SettingsTest"
              component={SettingsTest}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <RootStack.Screen
              name="Preferences"
              component={Preferences}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <RootStack.Screen
              name="WebView"
              component={WebViewScreen}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <RootStack.Screen
              name="Messages"
              component={Messages}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <RootStack.Screen
              name="DepartureLocation"
              component={DepartureLocationScreen}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <RootStack.Screen
              name="DestinationLocation"
              component={DestinationLocationScreen}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <RootStack.Screen
              name="Trips"
              component={TripsScreen}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <RootStack.Screen
              name="TripDetails"
              component={TripDetailsScreen}
              options={{
                headerShown: false,
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
            <RootStack.Screen
              name="WebView"
              component={WebViewScreen}
              options={{
                headerShown: false,
                ...TransitionPresets.ModalPresentationIOS,
              }}
            />
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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <FeaturesProvider>
            <AuthProvider>
              <PaperProvider>
                <ModalPresenterParent>
                  <BottomSheetModalProvider>
                    <StatusBar style="auto" />
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
