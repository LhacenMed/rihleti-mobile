import { useRef, useCallback, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import LocationInputs from "@components/LocationInputs";
import SafeContainer from "@components/SafeContainer";
// @ts-ignore
import { Location } from "@types/location";
import EmailBottomSheet from "~/components/EmailBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Button } from "react-native-paper";

export default function Page() {
  const [selectedDepartureLocation, setSelectedDepartureLocation] = useState<Location | null>(null);
  const [selectedDestinationLocation, setSelectedDestinationLocation] = useState<Location | null>(
    null
  );
  const emailBottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentEmailModal = useCallback(() => {
    emailBottomSheetRef.current?.present();
  }, []);

  const handleEmailSubmit = useCallback((email: string) => {
    console.log("Email submitted:", email);
    emailBottomSheetRef.current?.dismiss();
  }, []);

  const handleDepartureLocationSelect = (location: Location) => {
    setSelectedDepartureLocation(location);
  };

  const handleDestinationLocationSelect = (location: Location) => {
    setSelectedDestinationLocation(location);
  };

  return (
    <SafeContainer className="px-5">
      {/* Location Inputs */}
      <LocationInputs
        selectedDepartureCity={selectedDepartureLocation?.city || null}
        selectedDestinationCity={selectedDestinationLocation?.city || null}
        onDepartureLocationSelect={handleDepartureLocationSelect}
        onDestinationLocationSelect={handleDestinationLocationSelect}
      />

      {/* Search Button */}
      <TouchableOpacity className="items-center rounded-2xl bg-[#FF5A1F] p-4">
        <Text className="text-base font-semibold text-white">Search</Text>
      </TouchableOpacity>

      <Button style={{ marginTop: 20 }} mode="outlined" onPress={handlePresentEmailModal}>
        <Text>Show it</Text>
      </Button>

      <EmailBottomSheet
        ref={emailBottomSheetRef}
        onEmailSubmit={handleEmailSubmit}
        title="Continue with Email"
        placeholder="Enter your email address"
        buttonText="Continue"
      />
    </SafeContainer>
  );
}
