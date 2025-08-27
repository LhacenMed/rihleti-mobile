import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetFlatList, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import locations from "@utils/locationsData";
// @ts-ignore
import { Location } from "@types/location";

type LocationBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  onLocationSelect: (location: Location) => void;
  title: string;
};

const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  isVisible,
  onClose,
  onLocationSelect,
  title,
}) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const flatListRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ["75%"], []);

  // Handle modal visibility
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

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
    (location: Location) => {
      onLocationSelect(location);
      onClose();
      setSearchQuery("");
    },
    [onLocationSelect, onClose]
  );

  // Handle bottom sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
        setSearchQuery("");
      }
    },
    [onClose]
  );

  // Clear search when modal closes
  const handleDismiss = useCallback(() => {
    setSearchQuery("");
    onClose();
  }, [onClose]);

  // Scroll to top when search is cleared
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // Scroll to top function
  // const scrollToTop = useCallback(() => {
  //   flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  // }, []);

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

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        enableTouchThrough={false}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      // enablePanDownToClose={false}
      // enableOverDrag={false}
      // enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      onDismiss={handleDismiss}
      enableDismissOnClose={true}
      backdropComponent={renderBackdrop}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
    >
      {/* Locations List with Header */}
      <BottomSheetFlatList
        ref={flatListRef}
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
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#666666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search locations..."
                placeholderTextColor="#666666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                  <MaterialIcons name="clear" size={20} color="#666666" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
      />

      {/* Scroll to Top Button - removed since onScroll not supported */}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#1C1C1E",
  },
  handleIndicator: {
    backgroundColor: "#666666",
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3C",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    marginVertical: 16,
    paddingHorizontal: 12,
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
  scrollToTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FF5A1F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default LocationBottomSheet;
