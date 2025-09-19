import { withLayoutContext } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

export default function AppLayout() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  // Protect all app routes - redirect to auth if not logged in
  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  const { Navigator } = createStackNavigator();
  const AppStack = withLayoutContext(Navigator);

  const HeaderRight = () => (
    <View className="mr-4 flex-row items-center space-x-3">
      <TouchableOpacity className="p-2">
        <Ionicons name="search" size={22} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>
      <TouchableOpacity className="p-2">
        <Ionicons name="ellipsis-vertical" size={22} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>
    </View>
  );

  return (
    <AppStack
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
      }}
    >
      <AppStack.Screen
        name="(tabs)"
        options={({ route }: any) => {
          const focused = getFocusedRouteNameFromRoute(route) ?? "index";
          const titleMap: Record<string, string> = {
            index: "Home",
            explore: "Explore",
            bookings: "Bookings",
            settings: "Settings",
          };
          const headerTitle = titleMap[focused] ?? focused;
          return {
            headerShown: true,
            headerTitle,
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
            ...TransitionPresets.SlideFromRightIOS,
          };
        }}
      />
      <AppStack.Screen
        name="account"
        options={{
          presentation: "modal",
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <AppStack.Screen name="messages" />
      <AppStack.Screen name="new-chat" />
      <AppStack.Screen name="chat/[cid]" />
      <AppStack.Screen name="preferences" />
      <AppStack.Screen name="departure-location" />
      <AppStack.Screen name="destination-location" />
      <AppStack.Screen name="trips" />
      <AppStack.Screen name="trip-details" />
    </AppStack>
  );
}
