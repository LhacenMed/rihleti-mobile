import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FeaturesContextValue = {
  swipeEnabled: boolean;
  setSwipeEnabled: (enabled: boolean) => void;
};

const FeaturesContext = createContext<FeaturesContextValue | undefined>(undefined);

const SWIPE_ENABLED_KEY = "swipe_enabled";

export const FeaturesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [swipeEnabled, setSwipeEnabled] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    const loadSwipePreference = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(SWIPE_ENABLED_KEY);
        if (savedValue !== null) {
          setSwipeEnabled(JSON.parse(savedValue));
        }
      } catch (error) {
        console.error("Error loading swipe preference:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSwipePreference();
  }, []);

  // Save preference when it changes
  const handleSetSwipeEnabled = async (enabled: boolean) => {
    try {
      setSwipeEnabled(enabled);
      await AsyncStorage.setItem(SWIPE_ENABLED_KEY, JSON.stringify(enabled));
    } catch (error) {
      console.error("Error saving swipe preference:", error);
    }
  };

  const value = useMemo(
    () => ({
      swipeEnabled,
      setSwipeEnabled: handleSetSwipeEnabled,
    }),
    [swipeEnabled]
  );

  // Don't render children until preferences are loaded
  if (!isLoaded) {
    return null;
  }

  return <FeaturesContext.Provider value={value}>{children}</FeaturesContext.Provider>;
};

export const useFeatures = (): FeaturesContextValue => {
  const ctx = useContext(FeaturesContext);
  if (!ctx) {
    throw new Error("useFeatures must be used within a FeaturesProvider");
  }
  return ctx;
};
