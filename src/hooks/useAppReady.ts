import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "@/contexts/AuthContext";

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export const useAppReady = () => {
  const [isReady, setIsReady] = useState(false);
  const { loading: authLoading } = useAuth();

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    "Outfit-Regular": require("@/assets/fonts/Outfit/OutfitRegular.ttf"),
    "Outfit-Bold": require("@/assets/fonts/Outfit/OutfitBold.ttf"),
    "Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-Italic": require("@/assets/fonts/Poppins/Poppins-Italic.ttf"),
    "Poppins-BoldItalic": require("@/assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
  });

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Wait for all resources to be ready
        if (!fontsLoaded || authLoading) {
          return;
        }

        // Handle font loading errors
        if (fontError) {
          console.warn("Font loading error:", fontError);
          // You can decide whether to continue or show an error
        }

        // Add any additional initialization here
        // await initializeAsyncStorage();
        // await loadCachedData();
        // await setupAnalytics();

        // Small delay to ensure smooth transition
        await new Promise((resolve) => setTimeout(resolve, 100));

        setIsReady(true);
      } catch (error) {
        console.error("App initialization error:", error);
        // Even on error, mark as ready to prevent infinite loading
        setIsReady(true);
      }
    };

    prepareApp();
  }, [fontsLoaded, fontError, authLoading]);

  // Hide splash screen when ready
  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return {
    isReady,
    hasError: !!fontError,
  };
};
