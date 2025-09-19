import { useRef, useCallback, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
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
import {
  Button as ExpoButton,
  LinearProgress,
  Picker,
  Switch,
  TextInput,
  ContextMenu,
} from "@expo/ui/jetpack-compose";
// import { fetch } from "expo/fetch";

export default function Home() {
  const locationBottomSheetRef = useRef<BottomSheetModal>(null);
  const [departureLocation, setDepartureLocation] = useState<string | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<string | null>(null);
  const { isDark } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [value, setValue] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePresentEmailModal = useCallback(() => {
    locationBottomSheetRef.current?.present();
  }, []);

  const fetchApiData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/post");
      const data = await response.json();
      setApiData(data);
      console.log("API Response:", data);
    } catch (error) {
      console.error("Failed to fetch API data:", error);
    } finally {
      setIsLoading(false);
    }
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
    <SafeContainer style={{ paddingTop: 0 }}>
      <ScrollView className="flex-1 bg-background px-4 pb-20 pt-10">
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
        {/* <ContextMenu style={{ width: 150, height: 50 }}>
          <ContextMenu.Items>
            <ExpoButton
              variant="outlined"
              elementColors={{ contentColor: "white" }}
              onPress={() => console.log("Pressed Hello")}
            >
              Hello
            </ExpoButton>
            <ExpoButton
              variant="outlined"
              elementColors={{ contentColor: "white" }}
              onPress={() => console.log("Pressed Love it")}
            >
              Love it
            </ExpoButton>
            <Picker
              // label="Doggos"
              options={["very", "veery", "veeery", "much"]}
              variant="radio"
              selectedIndex={selectedIndex}
              onOptionSelected={({ nativeEvent: { index } }) => setSelectedIndex(index)}
            />
          </ContextMenu.Items>
          <ContextMenu.Trigger>
            <ExpoButton variant="outlined" style={{ width: 150, height: 50 }}>
              Show Menu
            </ExpoButton>
          </ContextMenu.Trigger>
        </ContextMenu>
        <ExpoButton
          variant="outlined"
          disabled={false}
          onPress={() => {
            true;
          }}
        >
          Edit profile
        </ExpoButton>
        <LinearProgress color="red" />
        <Picker
          options={["$", "$$", "$$$", "$$$$"]}
          selectedIndex={selectedIndex}
          elementColors={{ activeContentColor: "#ffffff", activeContainerColor: "#ffffff" }}
          onOptionSelected={({ nativeEvent: { index } }) => {
            setSelectedIndex(index);
          }}
          variant="radio"
        />
        <Picker
          options={["$", "$$", "$$$", "$$$$"]}
          selectedIndex={selectedIndex}
          onOptionSelected={({ nativeEvent: { index } }) => {
            setSelectedIndex(index);
          }}
          variant="segmented"
        />
        <Switch
          value={checked}
          onValueChange={(checked) => {
            setChecked(checked);
          }}
          color="green"
          label="Play music"
          variant="switch"
        />
        <TextInput
          autocorrection={false}
          defaultValue="A single line text input"
          onChangeText={setValue}
        /> */}
        {/* API Test Button */}
        <Button
          className="mt-4 items-center rounded-2xl bg-blue-500 p-4"
          onPress={fetchApiData}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader color="white" size={20} />
          ) : (
            <Text className="font-outfit-bold text-base text-white">Test API Endpoint</Text>
          )}
        </Button>
        {/* Display API Response */}
        {apiData && (
          <View className="mt-4 rounded-lg bg-gray-100 p-4">
            <Text className="mb-2 font-outfit-bold text-base text-gray-800">API Response:</Text>
            <Text className="text-sm text-gray-600">{JSON.stringify(apiData, null, 2)}</Text>
          </View>
        )}
      </ScrollView>
    </SafeContainer>
  );
}
