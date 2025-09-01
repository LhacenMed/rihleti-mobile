import { useRef, useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Pressable, Animated, ActivityIndicator, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
  const navigation = useNavigation();
  const animatedBgFrom = useRef(new Animated.Value(0)).current;
  const animatedBgTo = useRef(new Animated.Value(0)).current;
  const [departureCityName, setDepartureCityName] = useState<string | null>(null);
  const [destinationCityName, setDestinationCityName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSwapPressed, setIsSwapPressed] = useState<boolean>(false);

  const interpolatedBgFrom = animatedBgFrom.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1E1E1E", "#2A2A2A"],
  });

  const interpolatedBgTo = animatedBgTo.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1E1E1E", "#2A2A2A"],
  });

  const handlePressInFrom = () => {
    animatedBgFrom.setValue(1);
  };

  const handlePressOutFrom = () => {
    Animated.timing(animatedBgFrom, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handlePressInTo = () => {
    animatedBgTo.setValue(1);
  };

  const handlePressOutTo = () => {
    Animated.timing(animatedBgTo, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

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
    navigation.navigate("DepartureLocation" as never);
  };

  const handleDestinationInputPress = () => {
    onDestinationPress?.();
    navigation.navigate("DestinationLocation" as never);
  };

  const handleSwapPressIn = () => {
    setIsSwapPressed(true);
  };

  const handleSwapPressOut = () => {
    setIsSwapPressed(false);
  };

  return (
    <View style={styles.locationContainer}>
      <Animated.View style={[styles.inputFieldContainer, { backgroundColor: interpolatedBgFrom }]}>
        <Pressable
          onPressIn={handlePressInFrom}
          onPressOut={handlePressOutFrom}
          onPress={handleDepartureInputPress}
          style={styles.pressable}
        >
          <Text style={departureCityName ? styles.inputLabelWhite : styles.inputLabelGrey}>
            {departureCityName || "From?"}
            {loading && (
              <ActivityIndicator
                size="small"
                color="#666666"
                style={{
                  position: "absolute",
                  height: 10,
                  width: 10,
                  transform: [{ translateX: 10 }],
                }}
              />
            )}
          </Text>
        </Pressable>
      </Animated.View>
      <View style={styles.border} />
      <Animated.View
        style={[styles.inputFieldContainerSecond, { backgroundColor: interpolatedBgTo }]}
      >
        <Pressable
          onPressIn={handlePressInTo}
          onPressOut={handlePressOutTo}
          onPress={handleDestinationInputPress}
          style={styles.pressable}
        >
          <Text style={destinationCityName ? styles.inputLabelWhite : styles.inputLabelGrey}>
            {destinationCityName || "To?"}
          </Text>
        </Pressable>
      </Animated.View>
      <Pressable
        onPressIn={handleSwapPressIn}
        onPressOut={handleSwapPressOut}
        onPress={handleSwitchCities}
        style={[styles.swapButton, isSwapPressed && styles.swapButtonPressed]}
      >
        <MaterialIcons name="swap-vert" size={24} color="#fff" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  locationContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    marginBottom: 16,
    position: "relative",
  },
  inputFieldContainer: {
    borderColor: "#3A3A3C",
    borderBottomWidth: 2,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputFieldContainerSecond: {
    borderColor: "#3A3A3C",
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
    backgroundColor: "#3A3A3C",
    marginVertical: -1,
  },
  inputLabel: {
    color: "#666666",
    fontSize: 16,
  },
  inputLabelGrey: {
    color: "#666666",
    fontSize: 16,
  },
  inputLabelWhite: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  inputValue: {
    color: "#00FF00",
    fontSize: 16,
  },
  swapButton: {
    position: "absolute",
    right: 25,
    top: "50%",
    transform: [{ translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#3A3A3C",
    borderWidth: 1,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
  },
  swapButtonPressed: {
    backgroundColor: "#2C2C2E",
    borderColor: "#4A4A4C",
  },
});

export default LocationInputs;
