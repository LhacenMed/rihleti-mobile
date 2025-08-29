import { useRef, useCallback, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import LocationInputs from "@components/LocationInputs";
import SafeContainer from "@components/SafeContainer";
// import { Location } from "@/types/location";
// import EmailBottomSheet from "@/components/EmailBottomSheet";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
// import { Button } from "react-native-paper";
import { Button } from "@components/ui/button";

export default function Page() {
  const locationBottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentEmailModal = useCallback(() => {
    locationBottomSheetRef.current?.present();
  }, []);

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
    <SafeContainer
      className="px-4 pt-10"
      style={{ paddingTop: Platform.OS === "ios" ? 10 : 0 }}
    >
      {/* Location Inputs */}
      <LocationInputs />

      {/* Search Button */}
      <Button className="items-center rounded-2xl bg-[#FF5A1F] p-4">
        <Text className="text-base font-semibold text-white">Search</Text>
      </Button>

      <Button variant="outline" className="mt-10" onPress={handlePresentEmailModal}>
        Departure
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
