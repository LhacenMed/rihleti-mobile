import { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Pressable, Animated, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader } from "@/components/ui/loader";
// import { Location } from "@/types/location";

type LocationInputsProps = {
  onDeparturePress?: () => void;
  onDestinationPress?: () => void;
  onLocationsChange?: (departure: string | null, destination: string | null) => void;
};

const LocationInputs = ({
  onDeparturePress,
  onDestinationPress,
  onLocationsChange,
}: LocationInputsProps) => {
  // const navigation = useNavigation();
  // const animatedBgFrom = useRef(new Animated.Value(0)).current;
  // const animatedBgTo = useRef(new Animated.Value(0)).current;
  const [departureCityName, setDepartureCityName] = useState<string | null>(null);
  const [destinationCityName, setDestinationCityName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [isSwapPressed, setIsSwapPressed] = useState<boolean>(false);
  const { isDark } = useTheme();

  // const handlePressInFrom = () => {
  //   animatedBgFrom.setValue(1);
  // };

  // const handlePressOutFrom = () => {
  //   Animated.timing(animatedBgFrom, {
  //     toValue: 0,
  //     duration: 100,
  //     useNativeDriver: false,
  //   }).start();
  // };

  // const handlePressInTo = () => {
  //   animatedBgTo.setValue(1);
  // };

  // const handlePressOutTo = () => {
  //   Animated.timing(animatedBgTo, {
  //     toValue: 0,
  //     duration: 100,
  //     useNativeDriver: false,
  //   }).start();
  // };

  const getUserApiAddress = async () => {
    const response = await fetch("https://ipinfo.io/json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
    };
  };

  const handleSwitchCities = () => {
    const currentDeparture = departureCityName ?? null;
    const currentDestination = destinationCityName ?? null;

    // Swap values in state
    setDepartureCityName(currentDestination);
    setDestinationCityName(currentDeparture);
  };

  // Removed prop-driven sync; component now manages its own state/storage

  // Refresh location data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const refreshLocationData = async () => {
        // await new Promise((r) => setTimeout(r, 1000));
        try {
          const storedDepartureCity = await AsyncStorage.getItem("departureCityName");
          const storedDestinationCity = await AsyncStorage.getItem("destinationCityName");

          if (storedDepartureCity) {
            setDepartureCityName(storedDepartureCity);
          }

          if (storedDestinationCity) {
            setDestinationCityName(storedDestinationCity);
          }
        } catch (error) {
          console.error("Error refreshing location data:", error);
        }
      };

      refreshLocationData();
    }, [])
  );

  useEffect(() => {
    const fetchUserApiAddress = async () => {
      await new Promise((r) => setTimeout(r, 1000));
      setLoading(true);
      try {
        const storedDepartureCityName = await AsyncStorage.getItem("departureCityName");
        const storedDestinationCityName = await AsyncStorage.getItem("destinationCityName");
        // const recentStoredDepartureCityName = await AsyncStorage.getItem("recentDepartureLocation");
        // console.log(recentStoredDepartureCityName);

        if (storedDepartureCityName) {
          setDepartureCityName(storedDepartureCityName);
        }

        if (!storedDepartureCityName) {
          const state = await NetInfo.fetch();
          if (!state.isConnected) {
            console.log("No internet connection");
            setLoading(false);
            return;
          }
          const userApiAddress = await getUserApiAddress();
          console.log("User API Address:", userApiAddress.ip);
          console.log(
            "User Location:",
            userApiAddress.city,
            userApiAddress.region,
            userApiAddress.country
          );
          const resolvedCity = (userApiAddress.city || "").trim();
          if (resolvedCity === "Nouakchott") {
            setDepartureCityName(resolvedCity);
            await AsyncStorage.setItem("departureCityName", resolvedCity);
          }
        }

        if (storedDestinationCityName) {
          setDestinationCityName(storedDestinationCityName);
        }
      } catch (error) {
        console.error("Error fetching city names from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserApiAddress();
  }, []);

  useEffect(() => {
    const storeCityNames = async () => {
      // Update or clear departure
      if (departureCityName && departureCityName.length > 0) {
        await AsyncStorage.setItem("departureCityName", departureCityName);
      } else {
        await AsyncStorage.removeItem("departureCityName");
      }

      // Update or clear destination
      if (destinationCityName && destinationCityName.length > 0) {
        await AsyncStorage.setItem("destinationCityName", destinationCityName);
      } else {
        await AsyncStorage.removeItem("destinationCityName");
      }
    };

    storeCityNames();

    // Notify parent component of location changes
    onLocationsChange?.(departureCityName, destinationCityName);
  }, [departureCityName, destinationCityName, onLocationsChange]);

  const handleDepartureInputPress = () => {
    onDeparturePress?.();
    // navigation.navigate("DepartureLocation" as never);
    router.push("/(app)/departure-location");
  };

  const handleDestinationInputPress = () => {
    onDestinationPress?.();
    // navigation.navigate("DestinationLocation" as never);
    router.push("/(app)/destination-location");
  };

  return (
    <View style={styles.locationContainer} className="bg-card">
      <Animated.View style={[styles.inputFieldContainer]} className="border-border">
        <Pressable
          // onPressIn={handlePressInFrom}
          // onPressOut={handlePressOutFrom}
          onPress={handleDepartureInputPress}
          style={styles.pressable}
          className="flex-1 flex-row items-center gap-2"
        >
          <Text
            // style={departureCityName ? styles.inputLabelWhite : styles.inputLabelGrey}
            className={`text-lg ${departureCityName ? "text-foreground" : "text-muted-foreground"}`}
          >
            {departureCityName || "From?"}
          </Text>
          {loading && <Loader size={22} />}
        </Pressable>
      </Animated.View>
      {/* <View style={styles.border} className="bg-border" /> */}
      <Animated.View style={[styles.inputFieldContainerSecond]} className="border-border">
        <Pressable
          // onPressIn={handlePressInTo}
          // onPressOut={handlePressOutTo}
          onPress={handleDestinationInputPress}
          style={styles.pressable}
        >
          <Text
            // style={destinationCityName ? styles.inputLabelWhite : styles.inputLabelGrey}
            className={`text-lg ${destinationCityName ? "text-foreground" : "text-muted-foreground"}`}
          >
            {destinationCityName || "To?"}
          </Text>
        </Pressable>
      </Animated.View>
      <Pressable
        // onPressIn={handleSwapPressIn}
        // onPressOut={handleSwapPressOut}
        onPress={handleSwitchCities}
        style={styles.swapButton}
        className="border-border bg-card"
      >
        <MaterialIcons name="swap-vert" size={24} color={isDark ? "#fff" : "#000"} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  locationContainer: {
    borderRadius: 18,
    marginBottom: 16,
    position: "relative",
  },
  inputFieldContainer: {
    borderBottomWidth: 1,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputFieldContainerSecond: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
  },
  pressable: {
    padding: 15,
    paddingLeft: 20,
  },
  border: {
    height: 1,
    marginVertical: -1,
  },
  swapButton: {
    position: "absolute",
    right: 25,
    top: "50%",
    transform: [{ translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LocationInputs;
