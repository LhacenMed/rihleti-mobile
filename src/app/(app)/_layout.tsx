import { withLayoutContext } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

export default function AppLayout() {
  const { user } = useAuth();

  // Protect all app routes - redirect to auth if not logged in
  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  const { Navigator } = createStackNavigator();
  const AppStack = withLayoutContext(Navigator);

  return (
    <AppStack
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
      }}
    >
      <AppStack.Screen name="(tabs)" />
      <AppStack.Screen
        name="account"
        options={{
          presentation: "modal",
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <AppStack.Screen name="messages" />
      <AppStack.Screen name="preferences" />
      <AppStack.Screen name="departure-location" />
      <AppStack.Screen name="destination-location" />
      <AppStack.Screen name="trips" />
      <AppStack.Screen name="trip-details" />
    </AppStack>
  );
}
