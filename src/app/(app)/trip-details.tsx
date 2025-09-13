import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, Text } from "react-native";

export default function TripDetailsScreen() {
  const params = useLocalSearchParams();
  const { tripId } = params;

  // If no tripId is provided, redirect to a default or show an error
  useEffect(() => {
    if (!tripId) {
      // Redirect to a default trip or show an error
      router.replace("/(app)/(tabs)");
    }
  }, [tripId]);

  if (!tripId) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">Loading trip details...</Text>
      </View>
    );
  }

  // For now, redirect to the dynamic route
  // In a real app, you might show a trip details interface
  useEffect(() => {
    router.replace(`/(app)/trip-details/${tripId}`);
  }, [tripId]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-foreground">Loading trip details...</Text>
    </View>
  );
}