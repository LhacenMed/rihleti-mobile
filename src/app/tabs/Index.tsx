// import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import LocationInputs from "@components/LocationInputs";
import SafeContainer from "@components/SafeContainer";

export default function Page() {
  // const [activeInput, setActiveInput] = useState<"departure" | "destination">("departure");
  // const [isLocationModalVisible, setLocationModalVisible] = useState(false);

  // const handleModalOpen = () => {
  //   setLocationModalVisible(true);
  // };

  // const handleDeparturePress = () => {
  //   setActiveInput("departure");
  //   handleModalOpen();
  // };

  // const handleDestinationPress = () => {
  //   setActiveInput("destination");
  //   handleModalOpen();
  // };

  return (
    <SafeContainer style={styles.container}>
      {/* Location Inputs */}
      <LocationInputs
      // onDeparturePress={handleDeparturePress}
      // selectedDepartureCity={selectedDepartureCity}
      // onDestinationPress={handleDestinationPress}
      // selectedDestinationCity={selectedDestinationCity}
      />

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
    paddingHorizontal: 20,
  },
  searchButton: {
    backgroundColor: "#FF5A1F",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1C1C1E",
  },
});
