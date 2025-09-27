import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, RefreshControl, TouchableOpacity } from "react-native";
import SafeContainer from "@/components/SafeContainer";
import TripCard from "@/components/blocks/trip-card";
import { fetchTripsByLocations, fetchTripsByExactLocations } from "@/utils/trips-service";
import { TripWithRoute } from "@/types/trips";
// import Loader from "@/components/ui/loader";
import { router } from "expo-router";
import { Button, ProgressBar } from "react-native-paper";
// import { LinearProgress } from "@expo/ui/jetpack-compose";
// import { LinearProgress } from "react-native-elements";
import TripCardSkeleton from "@/components/blocks/trip-card-skeleton";
import { Ionicons } from "@expo/vector-icons";
import { Bars3BottomLeftIcon } from "react-native-heroicons/solid";
import { useTheme } from "@/contexts/ThemeContext";
import { showSearchModal } from "@/components/blocks/search-modal";
import { DropdownMenu } from "@/components/ui/dropdown/index";
import { PopupMenu } from "@/components/ui/popup-menu";

type TripsScreenProps = {
  route: {
    params: {
      departure: string;
      destination: string;
    };
  };
};

const makeIcon = (name: any) => (color: string) => <Ionicons name={name} size={20} color={color} />;

export default function TripsScreen({ route }: TripsScreenProps) {
  const { departure, destination } = route.params;
  const [trips, setTrips] = useState<TripWithRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isDark } = useTheme();

  const handleSelect = (key: string) => console.log("Selected:", key);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      // await new Promise((r) => setTimeout(r, 3000));
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
    router.push(`/(app)/trip-details/${trip.id}`);
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
          {/* <LinearProgress style={{ backgroundColor: "transparent" }} color="red" /> */}
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

  const items = [
    {
      id: "open",
      title: "Open",
      icon: { resource: "ic_menu_view" },
      useCustomRow: true,
      onSelect: () => console.log("Open selected"),
    },
    {
      id: "edit",
      title: "Edit",
      items: [
        {
          id: "rename",
          title: "Rename",
          icon: { resource: "ic_menu_edit" },
          useCustomRow: true,
          onSelect: () => console.log("Rename selected"),
        },
        {
          id: "move",
          title: "Move to…",
          items: [
            { id: "folder1", title: "Folder 1", onSelect: () => console.log("Move to Folder 1") },
            { id: "folder2", title: "Folder 2", onSelect: () => console.log("Move to Folder 2") },
          ],
        },
      ],
    },
    {
      id: "share",
      title: "Share",
      icon: { resource: "ic_menu_share" },
      useCustomRow: true,
      onSelect: () => console.log("Share selected"),
    },
    {
      id: "delete",
      title: "Delete",
      icon: { resource: "ic_delete" },
      useCustomRow: true,
      enabled: true,
      onSelect: () => console.log("Delete selected"),
    },
  ];

  // Right options
  const RightOptions = () => (
    <>
      {/* <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <View className="">
            <Ionicons name="ellipsis-vertical" size={20} color="white" />
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" maxHeight={250}>
          <DropdownMenu.Item
            title="Mute"
            icon={makeIcon("volume-mute-outline")}
            onSelect={() => handleSelect("mute")}
          />
          <DropdownMenu.Item
            title="Video Call"
            icon={makeIcon("videocam-outline")}
            onSelect={() => handleSelect("video")}
          />
          <DropdownMenu.Item
            title="Search"
            icon={makeIcon("search-outline")}
            onSelect={() => handleSelect("search")}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root> */}
      <PopupMenu
        items={items}
        style={{ textSizeSp: 15, itemPaddingHorizontalDp: 12, forceCustomRow: true }}
        onDismiss={() => {
          console.log("Dismissed");
        }}
      >
        <Button compact>
          <Ionicons name="ellipsis-vertical" size={20} color="white" />
        </Button>
      </PopupMenu>
    </>
  );

  return (
    <SafeContainer
      className="px-4"
      header={{
        titleComponent: <TripTitleComponent />,
        bottomComponent: <TripsFilter />,
        rightOptions: true,
        rightComponent: <RightOptions />,
        showBackButton: true,
        onBackPress: () => router.back(),
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
