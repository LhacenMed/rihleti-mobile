import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TripWithRoute } from "../types/trips";
import { formatTripTime, formatTripDate, formatPrice } from "../utils/trips-service";

type TripCardProps = {
  trip: TripWithRoute;
  onPress: (trip: TripWithRoute) => void;
};

export default function TripCard({ trip, onPress }: TripCardProps) {
  const { route, departure_time, arrival_time, price, origin, destination } = trip;

  return (
    <TouchableOpacity
      onPress={() => onPress(trip)}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700"
      activeOpacity={0.7}
    >
      {/* Route Info */}
      <View className="mb-3">
        <Text className="text-lg font-semibold text-black dark:text-white">
          {origin?.address} → {destination?.address}
        </Text>
        {route?.name && route.name !== "undefined" && (
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Route: {route.name}
          </Text>
        )}
      </View>

      {/* Time and Date */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-1">
          <Text className="text-sm text-gray-600 dark:text-gray-400">Departure</Text>
          <Text className="text-base font-medium text-black dark:text-white">
            {formatTripTime(departure_time)}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {formatTripDate(departure_time)}
          </Text>
        </View>

        {arrival_time && (
          <View className="flex-1 items-end">
            <Text className="text-sm text-gray-600 dark:text-gray-400">Arrival</Text>
            <Text className="text-base font-medium text-black dark:text-white">
              {formatTripTime(arrival_time)}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {formatTripDate(arrival_time)}
            </Text>
          </View>
        )}
      </View>

      {/* Additional Info */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          {route?.distance_km && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 mr-4">
              📍 {route.distance_km} km
            </Text>
          )}
          {route?.duration && (
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              ⏱️ {route.duration}
            </Text>
          )}
        </View>
        
        <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {formatPrice(price)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
