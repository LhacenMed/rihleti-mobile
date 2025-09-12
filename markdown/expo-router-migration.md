# Complete Migration Guide: React Navigation to Expo Router

## Overview

This guide will walk you through migrating your Rihleti mobile app from React Navigation to Expo Router, implementing file-based routing, authentication flows, and maintaining all current functionality.

## Prerequisites

Before starting the migration:
- Ensure you're using Expo SDK 50+ (recommended: SDK 52+)
- Backup your current project
- Review the current navigation structure in your App.tsx

## Step 1: Install Expo Router

```bash
# Install Expo Router
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# Remove React Navigation dependencies (if no longer needed elsewhere)
npm uninstall @react-navigation/native @react-navigation/stack @react-navigation/material-top-tabs react-native-gesture-handler
```

## Step 2: Update Configuration Files

### 2.1 Update `package.json`
Add the main entry point for Expo Router:

```json
{
  "main": "expo-router/entry"
}
```

### 2.2 Update `app.config.js`
```javascript
export default {
  expo: {
    name: "rihleti",
    slug: "rihleti",
    scheme: "rihleti", // Add this for deep linking
    // ... your existing config
  },
};
```

### 2.3 Update `metro.config.js`
```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

module.exports = withNativeWind(config, { input: './global.css' });
```

## Step 3: Restructure Project Directory

Create the new file structure following Expo Router conventions:

### 3.1 Create New Directory Structure
```
src/
├── app/
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Root redirect/initial screen
│   ├── +not-found.tsx           # 404 page
│   │
│   ├── (auth)/                  # Auth group (hidden from URL)
│   │   ├── _layout.tsx          # Auth layout
│   │   ├── welcome.tsx          # WelcomeScreen
│   │   ├── login.tsx            # LoginScreen
│   │   ├── signup.tsx           # SignupScreen
│   │   └── verify-otp.tsx       # VerifyOTPScreen
│   │
│   ├── (app)/                   # Authenticated app group
│   │   ├── _layout.tsx          # App layout with tabs
│   │   ├── (tabs)/              # Tab navigation
│   │   │   ├── _layout.tsx      # Tab layout
│   │   │   ├── index.tsx        # Home tab (Home.tsx)
│   │   │   ├── explore.tsx      # Explore tab
│   │   │   ├── bookings.tsx     # Bookings tab
│   │   │   └── settings.tsx     # Settings tab
│   │   │
│   │   ├── account.tsx          # Modal screen
│   │   ├── messages.tsx         # Stack screen
│   │   ├── preferences.tsx      # Stack screen
│   │   ├── departure-location.tsx
│   │   ├── destination-location.tsx
│   │   ├── trips.tsx
│   │   └── trip-details.tsx
│   │
│   ├── settings-test.tsx        # Shared screen
│   └── webview.tsx              # Shared modal screen
│
├── components/ (existing structure)
├── contexts/ (existing structure)
├── hooks/ (existing structure)
├── lib/ (existing structure)
├── types/ (existing structure)
└── utils/ (existing structure)
```

## Step 4: Create Layout Files

### 4.1 Root Layout (`src/app/_layout.tsx`)
```typescript
import "react-native-gesture-handler";
import "../global.css";
import "@/utils/haptic";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PaperProvider } from "react-native-paper";
import { ModalPresenterParent } from "@whitespectre/rn-modal-presenter";

import { toastConfig } from "@/components/ui/toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { FeaturesProvider } from "@/contexts/FeaturesContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout() {
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
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="index" />
                      <Stack.Screen name="(auth)" />
                      <Stack.Screen name="(app)" />
                      <Stack.Screen 
                        name="settings-test" 
                        options={{ 
                          presentation: "modal",
                          headerShown: false 
                        }} 
                      />
                      <Stack.Screen 
                        name="webview" 
                        options={{ 
                          presentation: "modal",
                          headerShown: false 
                        }} 
                      />
                    </Stack>
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

### 4.2 Root Index with Authentication Logic (`src/app/index.tsx`)
```typescript
import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useAppReady } from "@/hooks/useAppReady";
import { View } from "react-native";

export default function Index() {
  const { user } = useAuth();
  const { isReady } = useAppReady();

  // Show loading while app initializes
  if (!isReady) {
    return <View style={{ flex: 1 }} />; // or your loading component
  }

  // Redirect based on authentication status
  if (user) {
    return <Redirect href="/(app)/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/welcome" />;
  }
}
```

### 4.3 Auth Layout (`src/app/(auth)/_layout.tsx`)
```typescript
import { Stack } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";

export default function AuthLayout() {
  const { user } = useAuth();

  // Redirect authenticated users away from auth screens
  if (user) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verify-otp" />
    </Stack>
  );
}
```

### 4.4 App Layout with Protected Routes (`src/app/(app)/_layout.tsx`)
```typescript
import { Stack } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";

export default function AppLayout() {
  const { user } = useAuth();

  // Protect all app routes - redirect to auth if not logged in
  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen 
        name="account" 
        options={{ 
          presentation: "modal",
          headerShown: false 
        }} 
      />
      <Stack.Screen name="messages" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="departure-location" />
      <Stack.Screen name="destination-location" />
      <Stack.Screen name="trips" />
      <Stack.Screen name="trip-details" />
    </Stack>
  );
}
```

### 4.5 Tabs Layout (`src/app/(app)/(tabs)/_layout.tsx`)
```typescript
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
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? "hsl(0 0% 4%)" : "hsl(0 0% 100%)",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
          height: 90,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
          color: isDark ? "#fff" : "#000",
        },
        headerLeft: () => null,
        headerRight: () => <HeaderRight />,
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
        tabBarPressColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Home",
          tabBarIcon: ({ focused }) => (
            <HomeIcon isFocused={focused} width={24} height={24} />
          ),
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
        }}
      />
    </Tabs>
  );
}
```

## Step 5: Migrate Screen Components

### 5.1 Convert Auth Screens

Create these files with your existing screen components:

**`src/app/(auth)/welcome.tsx`**
```typescript
import WelcomeScreen from "@/app/auth/WelcomeScreen";
export default WelcomeScreen;
```

**`src/app/(auth)/login.tsx`**
```typescript
import LoginScreen from "@/app/auth/LoginScreen";
export default LoginScreen;
```

**`src/app/(auth)/signup.tsx`**
```typescript
import SignupScreen from "@/app/auth/SignupScreen";
export default SignupScreen;
```

**`src/app/(auth)/verify-otp.tsx`**
```typescript
import VerifyOTPScreen from "@/app/auth/VerifyOTPScreen";
export default VerifyOTPScreen;
```

### 5.2 Convert Tab Screens

**`src/app/(app)/(tabs)/index.tsx`**
```typescript
import Home from "@/app/tabs/Home";
export default Home;
```

**`src/app/(app)/(tabs)/explore.tsx`**
```typescript
import Explore from "@/app/tabs/Explore";
export default Explore;
```

**`src/app/(app)/(tabs)/bookings.tsx`**
```typescript
import Bookings from "@/app/tabs/Bookings";
export default Bookings;
```

**`src/app/(app)/(tabs)/settings.tsx`**
```typescript
import Settings from "@/app/tabs/Settings";
export default Settings;
```

### 5.3 Convert Other App Screens

Create files for all other screens following the same pattern:

**`src/app/(app)/account.tsx`**
```typescript
import Account from "@/app/screens/Account";
export default Account;
```

**`src/app/(app)/messages.tsx`**
```typescript
import Messages from "@/app/screens/Messages";
export default Messages;
```

Continue this pattern for all remaining screens...

### 5.4 Convert Shared Screens

**`src/app/settings-test.tsx`**
```typescript
import SettingsTest from "@/app/screens/SettingsTest";
export default SettingsTest;
```

**`src/app/webview.tsx`**
```typescript
import WebViewScreen from "@/app/screens/WebView";
export default WebViewScreen;
```

## Step 6: Update Navigation Calls

### 6.1 Replace Navigation Hooks

Replace all React Navigation hooks and navigation calls in your components:

```typescript
// Before (React Navigation)
import { useNavigation } from "@react-navigation/native";
const navigation = useNavigation();
navigation.navigate("SomeScreen", { param: value });

// After (Expo Router)
import { router } from "expo-router";
router.push("/some-screen?param=value");
// or
router.push({ pathname: "/some-screen", params: { param: value } });
```

### 6.2 Update Navigation Methods

| React Navigation        | Expo Router           | Description                |
| ----------------------- | --------------------- | -------------------------- |
| `navigation.navigate()` | `router.push()`       | Navigate to route          |
| `navigation.replace()`  | `router.replace()`    | Replace current route      |
| `navigation.goBack()`   | `router.back()`       | Go back                    |
| `navigation.popToTop()` | `router.dismissAll()` | Dismiss all modals/screens |
| `navigation.reset()`    | `router.replace()`    | Reset navigation state     |

## Step 7: Handle Parameters and Dynamic Routes

### 7.1 Dynamic Routes
For screens that need parameters, create dynamic route files:

**`src/app/(app)/trip-details/[tripId].tsx`**
```typescript
import { useLocalSearchParams } from "expo-router";
import TripDetailsScreen from "@/app/screens/TripDetails";

export default function TripDetailsRoute() {
  const { tripId } = useLocalSearchParams();
  
  return <TripDetailsScreen tripId={tripId as string} />;
}
```

**`src/app/(app)/trips/[departure]/[destination].tsx`**
```typescript
import { useLocalSearchParams } from "expo-router";
import TripsScreen from "@/app/screens/Trips";

export default function TripsRoute() {
  const { departure, destination } = useLocalSearchParams();
  
  return (
    <TripsScreen 
      departure={departure as string} 
      destination={destination as string} 
    />
  );
}
```

### 7.2 Update Parameter Passing

Update your existing screen components to use Expo Router parameters:

```typescript
// In your existing screens, replace props with useLocalSearchParams
import { useLocalSearchParams } from "expo-router";

export default function SomeScreen() {
  const params = useLocalSearchParams();
  // Use params instead of route.params
}
```

## Step 8: Create 404 Page

**`src/app/+not-found.tsx`**
```typescript
import { Stack } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-xl font-bold">This screen doesn't exist.</Text>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="mt-4 py-2 px-4 bg-blue-500 rounded"
        >
          <Text className="text-white">Go to home screen</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
```

## Step 9: Update Existing Components

### 9.1 Update Navigation Calls in Components

Go through your existing components and update navigation calls:

```typescript
// Before
const navigation = useNavigation();
navigation.navigate("Account");

// After  
import { router } from "expo-router";
router.push("/(app)/account");
```

### 9.2 Update Deep Linking

If you have deep linking set up, update your URL schemes to match the new file-based routes.

## Step 10: Clean Up

### 10.1 Remove Old Navigation Code

1. Delete the old `App.tsx` content related to navigation
2. Remove unused React Navigation imports
3. Clean up any navigation-specific utility functions

### 10.2 Update Imports

Update any imports that reference the old navigation structure.

## Step 11: Testing

### 11.1 Test Authentication Flow
1. Test login/logout functionality
2. Verify protected routes work correctly
3. Check redirect behavior

### 11.2 Test Navigation
1. Test all tab navigation
2. Test modal presentations
3. Test parameter passing
4. Test back navigation behavior

### 11.3 Test Deep Links
```bash
# Test deep links (Android)
adb shell am start -W -a android.intent.action.VIEW -d "rihleti://some-route" com.yourcompany.rihleti

# Test deep links (iOS Simulator)
xcrun simctl openurl booted rihleti://some-route
```

## Step 12: Optional Enhancements

### 12.1 Add Loading States
Consider adding loading states for route transitions using Expo Router's built-in loading mechanisms.

### 12.2 Add Error Boundaries
Implement error boundaries for better error handling with Expo Router.

### 12.3 Optimize Bundle Size
Remove any unused React Navigation dependencies to reduce bundle size.

## Common Pitfalls and Solutions

### Authentication Issues
- **Problem**: Users can navigate to protected routes by typing URLs
- **Solution**: Use the layout-based protection shown in Step 4.4

### Parameter Passing
- **Problem**: Complex objects as parameters
- **Solution**: Use serializable parameters only, pass complex data via context or global state

### Tab Bar Customization
- **Problem**: Custom tab bar not working
- **Solution**: Use Expo Router's built-in tab customization options or create custom tab bar component

### Modal Behavior
- **Problem**: Modals don't behave as expected
- **Solution**: Use `presentation: "modal"` in screen options and proper routing patterns

## Migration Checklist

- [ ] Install Expo Router and dependencies
- [ ] Update configuration files
- [ ] Create new directory structure
- [ ] Create all layout files
- [ ] Migrate all screen components
- [ ] Update navigation calls throughout the app
- [ ] Handle dynamic routes and parameters
- [ ] Create 404 page
- [ ] Test authentication flow
- [ ] Test all navigation patterns
- [ ] Test parameter passing
- [ ] Test deep linking
- [ ] Clean up old navigation code
- [ ] Update documentation

## Conclusion

This migration will give you:
- **File-based routing**: More intuitive and organized navigation structure
- **Better developer experience**: Automatic route generation and type safety
- **Improved performance**: Optimized routing and lazy loading
- **Universal compatibility**: Better web support out of the box
- **Simpler authentication**: Layout-based route protection

The migration requires careful attention to authentication flow and parameter passing, but the result is a more maintainable and scalable navigation system.