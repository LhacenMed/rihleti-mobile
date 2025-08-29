import { useRef, useCallback, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LocationInputs from "@components/LocationInputs";
import SafeContainer from "@components/SafeContainer";
// import { Location } from "@/types/location";
// import EmailBottomSheet from "@/components/EmailBottomSheet";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
// import { Button } from "react-native-paper";
import { Button } from "@components/ui/button";
// import Toast from "react-native-toast-message";
import {
  showLocationErrorToast,
  showLocationSuccessToast,
  showSearchToast,
  showInfoToast,
  showWarningToast,
  showPrimaryToast,
} from "@utils/toast-helpers";

type RootStackParamList = {
  Trips: {
    departure: string;
    destination: string;
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function Page() {
  const navigation = useNavigation<NavigationProp>();
  const locationBottomSheetRef = useRef<BottomSheetModal>(null);
  const [departureLocation, setDepartureLocation] = useState<string | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<string | null>(null);

  const handlePresentEmailModal = useCallback(() => {
    locationBottomSheetRef.current?.present();
  }, []);

  const handleLocationsChange = useCallback(
    (departure: string | null, destination: string | null) => {
      setDepartureLocation(departure);
      setDestinationLocation(destination);

      // Show success toast when both locations are selected
      if (departure && destination) {
        showLocationSuccessToast(departure, destination);
      }
    },
    []
  );

  const handleSearchPress = useCallback(() => {
    if (!departureLocation || !destinationLocation) {
      // Show error toast for missing locations
      showLocationErrorToast();
      return;
    }

    // Show success toast before navigation
    showSearchToast(departureLocation, destinationLocation);

    // Navigate to trips screen
    navigation.navigate("Trips", {
      departure: departureLocation,
      destination: destinationLocation,
    });
  }, [departureLocation, destinationLocation, navigation]);

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
    <SafeContainer className="px-4 pt-10" style={{ paddingTop: Platform.OS === "ios" ? 10 : 0 }}>
      {/* Location Inputs */}
      <LocationInputs onLocationsChange={handleLocationsChange} />

      {/* Search Button */}
      <Button className="items-center rounded-2xl bg-[#FF5A1F] p-4" onPress={handleSearchPress}>
        <Text className="text-base font-semibold text-white">Search</Text>
      </Button>

      <Button variant="outline" className="mt-10" onPress={handlePresentEmailModal}>
        Departure
      </Button>

      {/* Toast Demo Buttons - Remove these in production */}
      {/* These buttons demonstrate different toast types for development/testing */}
      {/* <View className="mt-6 space-y-3">
        <Button
          variant="outline"
          className="border-blue-300 bg-blue-100"
          onPress={() => {
            showInfoToast("Information", "This is an informational message");
          }}
        >
          <Text className="text-blue-700">Show Info Toast</Text>
        </Button>

        <Button
          variant="outline"
          className="border-yellow-300 bg-yellow-100"
          onPress={() => {
            showWarningToast("Warning", "This is a warning message");
          }}
        >
          <Text className="text-yellow-700">Show Warning Toast</Text>
        </Button>

        <Button
          variant="outline"
          className="border-orange-300 bg-orange-100"
          onPress={() => {
            showPrimaryToast("Primary Message", "This uses the app's orange theme");
          }}
        >
          <Text className="text-orange-700">Show Primary Toast</Text>
        </Button>
      </View> */}

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
