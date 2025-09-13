import { useRef, useCallback, useState } from "react";
import { Platform, Text } from "react-native";
import { router } from "expo-router";
import LocationInputs from "@/components/blocks/location-inputs";
import SafeContainer from "@/components/SafeContainer";
import EmailBottomSheet from "@/components/blocks/email-bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Button } from "@/components/ui/button";
import { showLocationErrorToast } from "@/utils/toast-helpers";
import { showSearchModal } from "@/components/blocks/search-modal";
import { Loader } from "@/components/ui/loader";
import { useTheme } from "@/contexts/ThemeContext";

export default function Page() {
  const locationBottomSheetRef = useRef<BottomSheetModal>(null);
  const [departureLocation, setDepartureLocation] = useState<string | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<string | null>(null);
  const { isDark } = useTheme();

  const handlePresentEmailModal = useCallback(() => {
    locationBottomSheetRef.current?.present();
  }, []);

  const handleLocationsChange = useCallback(
    (departure: string | null, destination: string | null) => {
      setDepartureLocation(departure);
      setDestinationLocation(destination);
    },
    []
  );

  const handleSearchPress = useCallback(() => {
    if (!departureLocation || !destinationLocation) {
      // Show error toast for missing locations
      showLocationErrorToast();
      return;
    }

    // Navigate to trips screen
    router.push({
      pathname: `/(app)/trips/${departureLocation}/${destinationLocation}`,
    });
  }, [departureLocation, destinationLocation]);

  return (
    <SafeContainer className="px-4 pt-10" style={{ paddingTop: Platform.OS === "ios" ? 10 : 0 }}>
      <LocationInputs onLocationsChange={handleLocationsChange} />

      {/* Search Button */}
      <Button className="items-center rounded-2xl bg-[#FF5A1F] p-4" onPress={handleSearchPress}>
        <Text className="font-outfit-bold text-base text-white">Search</Text>
      </Button>

      <Button
        variant="outline"
        className="mt-10"
        // onPress={handlePresentEmailModal}
        onPress={() => showSearchModal("Nouakchott", "Wad Naga")}
      >
        Departure
      </Button>

      {/* <Loader color={isDark ? "white" : "black"} /> */}

      {/* Locations BottomSheet */}
      <EmailBottomSheet
        ref={locationBottomSheetRef}
        onEmailSubmit={() => {}}
        title="Continue with Email"
        placeholder="Enter your email address"
        buttonText="Continue"
      />
    </SafeContainer>
  );
}
