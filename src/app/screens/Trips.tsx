import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, RefreshControl, TouchableOpacity } from "react-native";
import SafeContainer from "@/components/SafeContainer";
import TripCard from "@/components/blocks/trip-card";
import { fetchTripsByLocations, fetchTripsByExactLocations } from "@/utils/trips-service";
import { TripWithRoute } from "@/types/trips";
// import Loader from "@/components/ui/loader";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button, ProgressBar } from "react-native-paper";
// import { LinearProgress } from "react-native-elements";
import TripCardSkeleton from "@/components/blocks/trip-card-skeleton";
import { Ionicons } from "@expo/vector-icons";
import { Bars3BottomLeftIcon } from "react-native-heroicons/solid";
import { useTheme } from "@/contexts/ThemeContext";
import { showSearchModal } from "@/components/blocks/search-modal";
// import DropdownMenu from "@/components/blocks/dropdown-menu";

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

  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isDark } = useTheme();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 3000));
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
    // Navigate to trip details screen with trip ID
    navigation.navigate("TripDetails", { tripId: trip.id });
  };

  const renderContent = () => {
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
      <View className="mt-2">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            departureTime={
              trip.departure_time
                ? new Date(trip.departure_time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A"
            }
            arrivalTime={
              trip.arrival_time
                ? new Date(trip.arrival_time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A"
            }
            departureCity={trip.origin?.address || "Unknown"}
            departureCode="N/A"
            arrivalCity={trip.destination?.address || "Unknown"}
            arrivalCode="N/A"
            airline="Turkish Airlines"
            price={`$${trip.price}`}
            duration="15h 25m"
            stops="2 stops"
            layoverDetails="1h 35m in BJL, 1h 30m in IST"
            nextDay={false}
            onPress={handleTripPress}
          />
        ))}
      </View>
    );
  };

  // Custom title component for the header
  const TripTitleComponent = () => (
    <TouchableOpacity
      onPress={() => showSearchModal(departure, destination)}
      className="w-full overflow-hidden rounded-[10px] border border-muted-foreground bg-secondary"
    >
      <View className="flex-column px-3 py-3">
        <Text className="text-sm font-medium text-foreground">
          {departure} - {destination}
        </Text>
        <Text className="mt-1 text-xs text-muted-foreground">29 Sep - 6 Oct</Text>
      </View>
      {loading && (
        <View className="absolute bottom-0 left-0 right-0">
          <ProgressBar indeterminate color="red" style={{ backgroundColor: "transparent" }} />
        </View>
      )}
    </TouchableOpacity>
  );

  const TripsFilter = () => {
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={{ paddingHorizontal: 16 }}
          className="flex-row"
        >
          {/* Sort Button */}
          <TouchableOpacity className="mx-1 ml-2 flex-row items-center rounded-xl border border-border bg-card px-4 py-2">
            <Bars3BottomLeftIcon
              size={20}
              color={isDark ? "#fff" : "#000"}
              style={{ marginRight: 5 }}
            />
            <Text className="text-sm font-medium text-foreground">Sort: Best</Text>
          </TouchableOpacity>

          {/* Filter Buttons */}
          <TouchableOpacity className="mx-1 rounded-xl border border-border bg-card px-4 py-2">
            <Text className="text-sm font-medium text-foreground">Stops</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mx-1 rounded-xl border border-border bg-card px-4 py-2">
            <Text className="text-sm font-medium text-foreground">Times</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mx-1 rounded-xl border border-border bg-card px-4 py-2">
            <Text className="text-sm font-medium text-foreground">Airlines</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mx-1 rounded-xl border border-border bg-card px-4 py-2">
            <Text className="text-sm font-medium text-foreground">Airports</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mx-1 mr-2 rounded-xl border border-border bg-card px-4 py-2">
            <Text className="text-sm font-medium text-foreground">Airports</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeContainer
      className="px-4"
      header={{
        titleComponent: <TripTitleComponent />,
        bottomComponent: <TripsFilter />,
        // rightComponent: (
        //   <DropdownMenu
        //     items={[
        //       { key: "new", title: "New", icon: "plus", iconAndroid: "logo-google" },
        //       { key: "all", title: "All", icon: "list", iconAndroid: "list" },
        //       { key: "starred", title: "Starred", icon: "star", iconAndroid: "star" },
        //     ]}
        //     onSelect={() => {}}
        //   />
        // ),
        showBackButton: true,
        onBackPress: () => navigation.goBack(),
      }}
    >
      {loading ? (
        <View className="mt-2">
          {[1, 2, 3, 4, 5].map((index) => (
            <TripCardSkeleton key={index} />
          ))}
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {renderContent()}
        </ScrollView>
      )}
    </SafeContainer>
  );
}
