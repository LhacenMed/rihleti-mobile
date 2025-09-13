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
