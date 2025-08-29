import { useRef, useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LocationInputs from "@components/LocationInputs";
import SafeContainer from "@components/SafeContainer";
import { Location } from "@/types/location";
// import EmailBottomSheet from "@/components/EmailBottomSheet";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Button } from "react-native-paper";

export default function Page() {
  const [selectedDepartureLocation, setSelectedDepartureLocation] = useState<Location | null>(null);
  const [selectedDestinationLocation, setSelectedDestinationLocation] = useState<Location | null>(
    null
  );
  const locationBottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentEmailModal = useCallback(() => {
    locationBottomSheetRef.current?.present();
  }, []);

  // const handleDepartureLocationSelect = (location: Location) => {
  //   setSelectedDepartureLocation(location);
  // };

  // const handleDestinationLocationSelect = (location: Location) => {
  //   setSelectedDestinationLocation(location);
  // };

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
    <SafeContainer className="px-5">
      {/* Location Inputs */}
      <LocationInputs
        selectedDepartureCity={selectedDepartureLocation?.city || null}
        selectedDestinationCity={selectedDestinationLocation?.city || null}
      />

      {/* Search Button */}
      <TouchableOpacity className="items-center rounded-2xl bg-[#FF5A1F] p-4">
        <Text className="text-base font-semibold text-white">Search</Text>
      </TouchableOpacity>

      <Button style={{ marginTop: 20 }} mode="outlined" onPress={handlePresentEmailModal}>
        Departure
      </Button>
      <Button style={{ marginTop: 20 }} mode="outlined" onPress={handlePresentEmailModal}>
        Destination
      </Button>

      {/* Locations BottomSheet */}
      <BottomSheetModal
        ref={locationBottomSheetRef}
        enableDismissOnClose={true}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex-1 px-6 py-8">
          <Text className="mb-6 text-center text-2xl font-bold text-black">Hi there</Text>
          <TouchableOpacity
            className={`rounded-lg bg-[#606c38] px-6 py-4`}
            onPress={() => {
              locationBottomSheetRef.current?.dismiss();
            }}
          >
            <Text className={`text-center text-base font-semibold text-white`}>Ok</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeContainer>
  );
}
