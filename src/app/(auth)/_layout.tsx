import { withLayoutContext } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

export default function AuthLayout() {
  const { user } = useAuth();

  // Redirect authenticated users away from auth screens
  if (user) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  const { Navigator } = createStackNavigator();
  const AuthStack = withLayoutContext(Navigator);

  return (
    <AuthStack
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        gestureEnabled: true,
      }}
    >
      <AuthStack.Screen name="welcome" />
      <AuthStack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen name="signup" />
      <AuthStack.Screen name="verify-otp" />
    </AuthStack>
  );
}
