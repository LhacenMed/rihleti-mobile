# Complete Migration Guide: React Navigation to Expo Router

## Overview
This guide will help you migrate your Rihleti mobile app from React Navigation to Expo Router while preserving your custom transition animations using the `TransitionPresets`.

## Phase 1: Install Dependencies and Setup

### 1.1 Install Expo Router
```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

### 1.2 Update package.json
Add the following to your `package.json`:
```json
{
  "main": "expo-router/entry"
}
```

### 1.3 Update app.config.js
Add the Expo Router plugin:
```javascript
export default {
  expo: {
    // ... your existing config
    plugins: [
      "expo-router",
      // ... your other plugins
    ],
    scheme: "rihleti", // Replace with your app scheme
  },
};
```

### 1.4 Create metro.config.js (if not already configured)
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

## Phase 2: Create Custom Stack with TransitionPresets

### 2.1 Create Custom Stack Layout Component
Create `src/components/layouts/CustomStack.tsx`:

```tsx
import { ParamListBase, StackNavigationState } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationEventMap,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createStackNavigator();

export const CustomStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  StackNavigationEventMap
>(Navigator);

// Export transition presets for easy use
export { TransitionPresets };
```

### 2.2 Create Custom Tabs Component
Create `src/components/layouts/CustomTabs.tsx`:

```tsx
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createMaterialTopTabNavigator();

export const CustomTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);
```

## Phase 3: Restructure Your App Directory

### 3.1 Create New App Structure
Move and restructure your files according to Expo Router conventions:

```md
app/
├── _layout.tsx                 (Root layout - replaces App.tsx logic)
├── index.tsx                   (Landing/Welcome screen)
├── (auth)/
│   ├── _layout.tsx            (Auth stack layout)
│   ├── login.tsx              (LoginScreen)
│   ├── signup.tsx             (SignupScreen)
│   └── verify-otp.tsx         (VerifyOTPScreen)
├── (tabs)/
│   ├── _layout.tsx            (Tabs layout with custom TabBar)
│   ├── index.tsx              (Home tab - default route)
│   ├── explore.tsx            (Explore tab)
│   ├── bookings.tsx           (Bookings tab)
│   └── settings.tsx           (Settings tab)
├── account.tsx                (Account screen)
├── messages.tsx               (Messages screen)
├── preferences.tsx            (Preferences screen)
├── departure-location.tsx     (DepartureLocation screen)
├── destination-location.tsx   (DestinationLocation screen)
├── trips.tsx                  (Trips screen)
├── trip-details.tsx           (TripDetails screen)
├── settings-test.tsx          (SettingsTest screen)
└── webview.tsx               (WebView screen)
```

### 3.2 Move Your Existing Components
Keep your existing structure for components:
```bash
# Keep these as-is:
src/components/
src/contexts/
src/hooks/
src/lib/
src/types/
src/utils/
src/assets/
```

## Phase 4: Create Layout Files

### 4.1 Root Layout (`app/_layout.tsx`)
```tsx
import "react-native-gesture-handler";
import "../global.css";
import "@/utils/haptic";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ModalPresenterParent } from "@whitespectre/rn-modal-presenter";
import Toast from "react-native-toast-message";
import { Slot } from "expo-router";
import React from "react";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { FeaturesProvider } from "@/contexts/FeaturesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { toastConfig } from "@/components/ui/toast";
import { useAppReady } from "@/hooks/useAppReady";

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 20 }}>
            Something went wrong. Please restart the app.
          </Text>
          <Text style={{ fontSize: 14, textAlign: "center", color: "#666" }}>
            {this.state.error?.message}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { isReady } = useAppReady();

  if (!isReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Slot />
    </ErrorBoundary>
  );
}

export default function Layout() {
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
```

### 4.2 Auth Stack Layout (`app/(auth)/_layout.tsx`)
```tsx
import { CustomStack, TransitionPresets } from "@/components/layouts/CustomStack";

export default function AuthLayout() {
  return (
    <CustomStack
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <CustomStack.Screen name="login" />
      <CustomStack.Screen name="signup" />
      <CustomStack.Screen 
        name="verify-otp" 
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </CustomStack>
  );
}
```

### 4.3 Main Tabs Layout (`app/(tabs)/_layout.tsx`)
```tsx
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomTabs } from "@/components/layouts/CustomTabs";
import { useTheme } from "@/contexts/ThemeContext";
import { useFeatures } from "@/contexts/FeaturesContext";
import TabBar from "@/components/TabBar";
import HomeIcon from "@/components/icons/tab-icons/HomeIcon";
import ExploreIcon from "@/components/icons/tab-icons/ExploreIcon";
import BookingsIcon from "@/components/icons/tab-icons/BookingsIcon";
import SettingsIcon from "@/components/icons/tab-icons/SettingsIcon";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// Header Right Component
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

export default function TabsLayout() {
  const { swipeEnabled } = useFeatures();
  const { isDark } = useTheme();

  return (
    <CustomTabs
      tabBarPosition="bottom"
      initialRouteName="index"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={({ route }: any) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
        return {
          tabBarStyle: {
            position: "relative",
            backgroundColor: isDark ? "hsl(0 0% 4%)" : "hsl(0 0% 100%)",
            borderTopColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
            borderTopWidth: 1,
            paddingVertical: 10,
          },
          tabBarActiveTintColor: "black",
          tabBarShowIcon: true,
          tabBarShowLabel: false,
          tabBarIndicatorStyle: { display: "none" },
          tabBarPressColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
          swipeEnabled,
          animationEnabled: false,
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
          headerLeft: () => null,
          headerRight: () => <HeaderRight />,
        };
      }}
    >
      <CustomTabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <HomeIcon isFocused={focused} width={24} height={24} />
          ),
        }}
      />
      <CustomTabs.Screen
        name="explore"
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ focused }) => (
            <ExploreIcon isFocused={focused} width={24} height={24} />
          ),
        }}
      />
      <CustomTabs.Screen
        name="bookings"
        options={{
          tabBarLabel: "Bookings",
          tabBarIcon: ({ focused }) => (
            <BookingsIcon isFocused={focused} width={24} height={24} />
          ),
        }}
      />
      <CustomTabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }) => (
            <SettingsIcon isFocused={focused} width={24} height={24} />
          ),
        }}
      />
    </CustomTabs>
  );
}
```

## Phase 5: Create Screen Files

### 5.1 Landing Page (`app/index.tsx`)
```tsx
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import WelcomeScreen from "@/app/screens/WelcomeScreen";

export default function Index() {
  const { user } = useAuth();
  
  if (user) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <WelcomeScreen />;
}
```

### 5.2 Auth Screens
Create `app/(auth)/login.tsx`:
```tsx
import LoginScreen from "@/app/auth/LoginScreen";
export default LoginScreen;
```

Create `app/(auth)/signup.tsx`:
```tsx
import SignupScreen from "@/app/auth/SignupScreen";
export default SignupScreen;
```

Create `app/(auth)/verify-otp.tsx`:
```tsx
import VerifyOTPScreen from "@/app/auth/VerifyOTPScreen";
export default VerifyOTPScreen;
```

### 5.3 Tab Screens
Create `app/(tabs)/index.tsx` (Home):
```tsx
import Home from "@/app/tabs/Home";
export default Home;
```

Create `app/(tabs)/explore.tsx`:
```tsx
import Explore from "@/app/tabs/Explore";
export default Explore;
```

Create `app/(tabs)/bookings.tsx`:
```tsx
import Bookings from "@/app/tabs/Bookings";
export default Bookings;
```

Create `app/(tabs)/settings.tsx`:
```tsx
import Settings from "@/app/tabs/Settings";
export default Settings;
```

### 5.4 Other Screens with Custom Transitions
Create `app/account.tsx`:
```tsx
import { CustomStack, TransitionPresets } from "@/components/layouts/CustomStack";
import Account from "@/app/screens/Account";

export default function AccountPage() {
  return (
    <>
      <CustomStack.Screen
        options={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <Account />
    </>
  );
}
```

Create similar files for other screens:
- `app/preferences.tsx`
- `app/messages.tsx`  
- `app/departure-location.tsx`
- `app/destination-location.tsx`
- `app/trips.tsx`
- `app/trip-details.tsx`
- `app/settings-test.tsx`
- `app/webview.tsx`

Each following this pattern:
```tsx
import { CustomStack, TransitionPresets } from "@/components/layouts/CustomStack";
import YourScreen from "@/app/screens/YourScreen";

export default function YourPage() {
  return (
    <>
      <CustomStack.Screen
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS, // or your desired transition
        }}
      />
      <YourScreen />
    </>
  );
}
```

## Phase 6: Update Navigation Calls

### 6.1 Replace Navigation Imports
In your screen components, replace:
```tsx
// OLD
import { useNavigation } from "@react-navigation/native";
const navigation = useNavigation();
navigation.navigate("ScreenName", params);

// NEW
import { useRouter } from "expo-router";
const router = useRouter();
router.push("/screen-name"); // or router.push({ pathname: "/screen-name", params: { ... } });
```

### 6.2 Update Parameter Passing
```tsx
// OLD
navigation.navigate("TripDetails", { tripId: "123" });

// NEW
router.push({ pathname: "/trip-details", params: { tripId: "123" } });
```

### 6.3 Handle Authentication Routing
In your `AuthContext.tsx`, update the authentication flow:
```tsx
import { useRouter, useSegments } from "expo-router";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const segments = useSegments();
  
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    
    if (!user && !inAuthGroup) {
      // Redirect to auth if not authenticated
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Redirect to main app if authenticated
      router.replace("/(tabs)");
    }
  }, [user, segments]);

  // ... rest of your auth logic
}
```

## Phase 7: Update TypeScript Types

### 7.1 Remove Old Navigation Types
Remove the old `RootStackParamList` from your App.tsx.

### 7.2 Enable Typed Routes (Optional)
Add to your `app.config.js`:
```javascript
export default {
  expo: {
    experiments: {
      typedRoutes: true
    }
  }
}
```

## Phase 8: Clean Up

### 8.1 Remove Old Files
- Delete the old `App.tsx` file
- Remove unused React Navigation imports from components

### 8.2 Update package.json
Remove these dependencies if no longer needed:
```bash
npm uninstall @react-navigation/native @react-navigation/stack @react-navigation/material-top-tabs
```

### 8.3 Test Your App
```bash
npx expo start --clear
```

## Phase 9: Advanced Features (Optional)

### 9.1 Add Deep Linking Support
Your app now automatically supports deep linking to any screen via URLs!

### 9.2 Add Web Support
Your navigation now works on web out of the box.

## Migration Checklist

- [ ] Install Expo Router dependencies
- [ ] Update package.json main entry
- [ ] Create custom stack and tabs components
- [ ] Restructure app directory
- [ ] Create all layout files
- [ ] Create all screen files with transitions
- [ ] Update navigation calls in components
- [ ] Update authentication routing
- [ ] Remove old navigation dependencies
- [ ] Test the app thoroughly
- [ ] Test deep linking
- [ ] Test on all platforms (iOS, Android, Web)

## Troubleshooting

### Common Issues:
1. **Import paths**: Make sure all your `@/` imports still work with the new structure
2. **Context providers**: Ensure all context providers are properly wrapped in the root layout
3. **Screen transitions**: Test that all your custom transitions work as expected
4. **Tab navigation**: Verify that your custom TabBar component works with the new tabs setup

### Performance Tips:
- Use lazy loading for screens that aren't immediately needed
- Optimize your bundle size by removing unused React Navigation dependencies
- Test memory usage to ensure the custom stack doesn't cause issues

This migration preserves all your existing custom transitions while giving you the benefits of Expo Router's file-based routing system!