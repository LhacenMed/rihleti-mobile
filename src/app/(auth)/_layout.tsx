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
      <Stack.Screen
        name="welcome"
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          animation: "ios_from_right",
        }}
      />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verify-otp" />
    </Stack>
  );
}
