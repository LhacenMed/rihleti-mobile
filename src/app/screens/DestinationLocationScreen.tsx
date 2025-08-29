import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Switch,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ExpoLocation from "expo-location";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import locations from "@utils/locationsData";
import { Location } from "@/types/location";
import { showModal } from "@whitespectre/rn-modal-presenter";
import Modal from "@/components/ui/modal";

const DestinationLocationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  // const [nearbyAirports, setNearbyAirports] = useState<boolean>(true);
  const [fetchingCurrent, setFetchingCurrent] = useState<boolean>(false);

  // Filter locations based on search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) {
      return locations;
    }

    const query = searchQuery.toLowerCase();
    return locations.filter(
      (location) =>
        location.city.toLowerCase().includes(query) ||
        location.region.toLowerCase().includes(query) ||
        location.country.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Handle location selection
  const handleLocationSelect = useCallback(
    async (location: Location) => {
      // Store the selected destination location
      await AsyncStorage.setItem("destinationCityName", location.city);
      await AsyncStorage.setItem("recentDestinationLocation", JSON.stringify(location));
      navigation.goBack();
    },
    [navigation]
  );

  const handleUseCurrentLocation = useCallback(async () => {
    try {
      setFetchingCurrent(true);
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showModal(Modal, {
          title: "Enable location",
          subtitle: "Allow access to use Current location.",
          buttons: [
            { text: "Cancel", style: "cancel" },
            { text: "Retry", onPress: handleUseCurrentLocation },
          ],
        });
        return;
      }

      const position = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Highest,
      });

      const [address] = await ExpoLocation.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const city = address?.city || address?.subregion || "";
      const region = address?.region || address?.subregion || "";
      const country = address?.country || address?.isoCountryCode || "";

      const currentLocation: Location = {
        id: -1,
        city,
        region,
        country,
      } as unknown as Location;
      await AsyncStorage.setItem("destinationCityName", currentLocation.city);
      await AsyncStorage.setItem("recentDestinationLocation", JSON.stringify(currentLocation));
      navigation.goBack();
    } catch (e) {
      console.error("Failed to fetch precise current location:", e);
      const message = String((e as Error)?.message || e || "");
      if (message.includes("unsatisfied device settings")) {
        showModal(Modal, {
          title: "Enable location",
          subtitle: "Allow access and turn on location to use Current location.",
          buttons: [
            { text: "Cancel", style: "cancel" },
            { text: "Retry", onPress: handleUseCurrentLocation },
          ],
        });
      }
    } finally {
      setFetchingCurrent(false);
    }
  }, [navigation]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Go back
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Render location item
  const renderLocationItem = useCallback(
    ({ item }: { item: Location }) => (
      <TouchableOpacity style={styles.locationItem} onPress={() => handleLocationSelect(item)}>
        <View style={styles.locationInfo}>
          <Text style={styles.cityName}>{item.city}</Text>
          <Text style={styles.regionCountry}>
            {item.region}, {item.country}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#666666" />
      </TouchableOpacity>
    ),
    [handleLocationSelect]
  );

  // Render empty state
  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <MaterialIcons name="search-off" size={48} color="#666666" />
        <Text style={styles.emptyStateText}>No locations found</Text>
        <Text style={styles.emptyStateSubtext}>Try searching with different keywords</Text>
      </View>
    ),
    []
  );

  return (
    <View className="-mt-7 flex-1 bg-background">
      {/* Top search-as-header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleGoBack} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <MaterialIcons name="clear" size={20} color="#666666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Nearby airports toggle */}
      {/* <View style={styles.optionRow}>
        <Text style={styles.optionText}>Add nearby airports</Text>
        <Switch
          value={nearbyAirports}
          onValueChange={setNearbyAirports}
          trackColor={{ false: "#3A3A3C", true: "#3A3A3C" }}
          thumbColor={nearbyAirports ? "#FF5A1F" : "#B0B0B0"}
        />
      </View> */}

      {/* Current location */}
      <TouchableOpacity style={styles.currentLocationRow} onPress={handleUseCurrentLocation}>
        <MaterialIcons name="location-on" size={20} color="#FFFFFF" />
        <Text style={styles.currentLocationText}>Current location</Text>
        {fetchingCurrent && (
          <ActivityIndicator size="small" color="#999999" style={styles.currentSpinner} />
        )}
      </TouchableOpacity>

      {/* Divider and sign-in tip */}
      <View style={styles.divider} />
      <View style={styles.tipContainer}>
        <Text style={styles.tipText}>Tip: Sign in to view your recent searches</Text>
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* Locations List */}
      <FlatList
        data={filteredLocations}
        renderItem={renderLocationItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3C",
  },
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: "#FFFFFF",
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  currentLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 25,
    gap: 10,
  },
  currentLocationText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  currentSpinner: {
    marginLeft: "auto",
  },
  divider: {
    height: 1,
    backgroundColor: "#3A3A3C",
    marginVertical: 8,
    marginHorizontal: 12,
  },
  tipContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tipText: {
    color: "#B0B0B0",
    fontSize: 14,
    marginBottom: 12,
  },
  signInButton: {
    borderWidth: 1,
    borderColor: "#3A3A3C",
    borderRadius: 10,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 20,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  locationInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  regionCountry: {
    fontSize: 14,
    color: "#666666",
  },
  separator: {
    height: 1,
    backgroundColor: "#3A3A3C",
    marginHorizontal: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
    textAlign: "center",
  },
});

export default DestinationLocationScreen;
