import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useAppReady } from "@/hooks/useAppReady";
// import { View } from "react-native";
import { Loader } from "@/components/ui/loader";

export default function Index() {
  const { user } = useAuth();
  const { isReady } = useAppReady();

  // Show loading while app initializes
  if (!isReady) {
    return <Loader />; // or your loading component
  }

  // Redirect based on authentication status
  if (user) {
    return <Redirect href="/(app)/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/welcome" />;
  }
}
