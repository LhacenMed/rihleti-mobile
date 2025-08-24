import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import LocationInputs from "@components/LocationInputs";
import SafeContainer from "@components/SafeContainer";

export default function Page() {
  const [activeInput, setActiveInput] = useState<"departure" | "destination">("departure");
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);

  const handleModalOpen = () => {
    setLocationModalVisible(true);
  };

  const handleDeparturePress = () => {
    setActiveInput("departure");
    handleModalOpen();
  };

  const handleDestinationPress = () => {
    setActiveInput("destination");
    handleModalOpen();
  };

  return (
    <SafeContainer className="flex-1 bg-[#171717] px-5">
      {/* Location Inputs */}
      <LocationInputs
      onDeparturePress={handleDeparturePress}
      // selectedDepartureCity={selectedDepartureCity}
      onDestinationPress={handleDestinationPress}
      // selectedDestinationCity={selectedDestinationCity}
      />

      {/* Search Button */}
      <TouchableOpacity className="items-center rounded-2xl bg-[#FF5A1F] p-4">
        <Text className="text-base font-semibold text-white">Search</Text>
      </TouchableOpacity>
    </SafeContainer>
  );
}
