import React from "react";
import { View, Text, ScrollView } from "react-native";
import SafeContainer from "@components/SafeContainer";

type TripsScreenProps = {
  route: {
    params: {
      departure: string;
      destination: string;
    };
  };
};

export default function TripsScreen({ route }: TripsScreenProps) {
  const { departure, destination } = route.params;

  return (
    <SafeContainer className="px-4 pt-10">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-black dark:text-white">
            Available Trips
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-400 mt-2">
            {departure} → {destination}
          </Text>
        </View>

        {/* Placeholder for trips */}
        <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-4">
          <Text className="text-center text-gray-500 dark:text-gray-400 text-lg">
            Trips will be loaded from Supabase database
          </Text>
          <Text className="text-center text-gray-400 dark:text-gray-500 text-sm mt-2">
            Departure: {departure}
          </Text>
          <Text className="text-center text-gray-400 dark:text-gray-500 text-sm">
            Destination: {destination}
          </Text>
        </View>

        {/* Additional placeholder content */}
        <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-4">
          <Text className="text-center text-gray-500 dark:text-gray-400">
            This screen will display available trips based on the selected locations.
          </Text>
        </View>
      </ScrollView>
    </SafeContainer>
  );
}
