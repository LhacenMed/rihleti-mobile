import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ExpoLocation from "expo-location";
import * as Localization from "expo-localization";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import locations from "@/utils/locations-data";
import { Location } from "@/types/location";
import { showModal } from "@whitespectre/rn-modal-presenter";
import Modal from "@/components/ui/modal";

const DepartureLocationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [fetchingCurrent, setFetchingCurrent] = useState<boolean>(false);

  // Filter locations based on search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) {
      return showAllLocations ? locations : [];
    }

    const query = searchQuery.toLowerCase();
    return locations.filter(
      (location) =>
        location.city.toLowerCase().includes(query) ||
        location.region.toLowerCase().includes(query) ||
        location.country.toLowerCase().includes(query)
    );
  }, [searchQuery, showAllLocations]);

  // Handle location selection
  const handleLocationSelect = useCallback(
    async (location: Location) => {
      // Store the selected departure location
      await AsyncStorage.setItem("departureCityName", location.city);
      await AsyncStorage.setItem("recentDepartureLocation", JSON.stringify(location));
      navigation.goBack();
    },
    [navigation]
  );

  const handleUseCurrentLocation = useCallback(async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

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
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      const [address] = await ExpoLocation.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      console.log(address);

      // Get current device language
      const deviceLanguage = Localization.getLocales()[0]?.languageCode;
      console.log("Current device language:", deviceLanguage);

      // Check if device language is not English
      if (deviceLanguage && !deviceLanguage.startsWith("en")) {
        console.log("Device language is not English, address may be in local language");
        showModal(Modal, {
          title: "Change language",
          subtitle:
            "Change your device's language to english to let the app get you current location.",
          buttons: [
            { text: "Cancel", style: "cancel" },
            { text: "Retry", onPress: handleUseCurrentLocation },
          ],
        });
        // TODO: implement a solution better than this
        return;
      }

      const city = address?.city || address?.subregion || "";
      const region = address?.region || address?.subregion || "";
      const country = address?.country || address?.isoCountryCode || "";

      const currentLocation: Location = {
        id: -1,
        city,
        region,
        country,
      } as unknown as Location;
      await AsyncStorage.setItem("departureCityName", currentLocation.city);
      await AsyncStorage.setItem("recentDepartureLocation", JSON.stringify(currentLocation));
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

  // Render search results or all locations toggle
  const renderSearchResults = useCallback(() => {
    if (searchQuery.trim()) {
      return (
        <View style={styles.allLocationsContainer}>
          <View style={styles.allLocationsHeader}>
            <Text style={styles.locationsHeader}>
              {filteredLocations.length} location{filteredLocations.length !== 1 ? "s" : ""} found
            </Text>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                backgroundColor: "transparent",
              }}
            >
              <Text style={styles.hideAllText}></Text>
            </TouchableOpacity>
          </View>
          {filteredLocations.length > 0 ? (
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {filteredLocations.map((item) => (
                <React.Fragment key={item.id}>
                  {renderLocationItem({ item })}
                  <View style={styles.separator} />
                </React.Fragment>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No locations found</Text>
            </View>
          )}
        </View>
      );
    }

    if (showAllLocations) {
      return (
        <View style={styles.allLocationsContainer}>
          <View style={styles.allLocationsHeader}>
            <Text style={styles.locationsHeader}>All Locations</Text>
            <TouchableOpacity
              onPress={() => setShowAllLocations(false)}
              style={styles.hideAllButton}
            >
              <Text style={styles.hideAllText}>Hide</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {locations.map((item) => (
              <React.Fragment key={item.id}>
                {renderLocationItem({ item })}
                <View style={styles.separator} />
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.emptyStateContainer}>
        <MaterialIcons name="search" size={48} color="#666666" />
        <Text style={styles.emptyStateText}>Search for a location</Text>
        <Text style={styles.emptyStateSubtext}>Type a city, region, or country name</Text>
        <TouchableOpacity style={styles.showAllButton} onPress={() => setShowAllLocations(true)}>
          <Text style={styles.showAllText}>Show All Locations</Text>
        </TouchableOpacity>
      </View>
    );
  }, [searchQuery, showAllLocations, filteredLocations, renderLocationItem]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-background">
        {/* Top search-as-header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleGoBack} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#666666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="From where?"
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
              blurOnSubmit={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                <MaterialIcons name="clear" size={20} color="#666666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

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

        {/* Search Results or All Locations */}
        {renderSearchResults()}
      </View>
    </TouchableWithoutFeedback>
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
  searchResultsContainer: {
    flex: 1,
  },
  allLocationsContainer: {
    flex: 1,
  },
  allLocationsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3C",
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  locationsHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  hideAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#3A3A3C",
  },
  hideAllText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  showAllButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  showAllText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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
    // marginHorizontal: 20,
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
  scrollView: {
    flex: 1,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
});

export default DepartureLocationScreen;
