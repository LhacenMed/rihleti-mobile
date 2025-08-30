import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, RefreshControl } from "react-native";
import SafeContainer from "@components/SafeContainer";
import TripCard from "../../components/TripCard";
import { fetchTripsByLocations, fetchTripsByExactLocations } from "../../utils/trips-service";
import { TripWithRoute } from "../../types/trips";
import Loader from "../../components/ui/loader";
import { useNavigation } from "@react-navigation/native";

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
  const [trips, setTrips] = useState<TripWithRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTrips = await fetchTripsByExactLocations(departure, destination);
      setTrips(fetchedTrips);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to load trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTrips();
  }, [departure, destination]);

  const handleTripPress = (trip: TripWithRoute) => {
    Alert.alert(
      "Trip Selected",
      `You selected a trip from ${trip.origin?.address || "Unknown"} to ${trip.destination?.address || "Unknown"} for ${trip.price}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Book Now", onPress: () => console.log("Book trip:", trip.id) },
      ]
    );
  };

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="mb-4 text-center text-lg text-red-600 dark:text-red-400">{error}</Text>
          <Text className="text-blue-600 underline dark:text-blue-400" onPress={fetchTrips}>
            Tap to retry
          </Text>
        </View>
      );
    }

    if (trips.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="mb-2 text-center text-lg text-gray-600 dark:text-gray-400">
            No trips found
          </Text>
          <Text className="text-center text-base text-gray-500 dark:text-gray-500">
            No available trips found for the selected route.
          </Text>
          <Text className="mt-2 text-center text-sm text-gray-400 dark:text-gray-600">
            Try adjusting your departure or destination locations.
          </Text>
        </View>
      );
    }

    return (
      <View className="mb-6">
        <Text className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Found {trips.length} trip{trips.length !== 1 ? "s" : ""}
        </Text>
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onPress={handleTripPress} />
        ))}
      </View>
    );
  };

  return (
    <SafeContainer
      className="px-4"
      header={{
        title: "Trips",
        showBackButton: true,
        onBackPress: () => navigation.goBack(),
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-black dark:text-white">Available Trips</Text>
          <Text className="mt-2 text-base text-gray-600 dark:text-gray-400">
            {departure} → {destination}
          </Text>
        </View>

        {/* Content */}
        {renderContent()}
      </ScrollView>
    </SafeContainer>
  );
}
