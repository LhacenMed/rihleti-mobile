import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import SafeContainer from "@/components/SafeContainer";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type TripDetailsScreenProps = {
  route: {
    params: {
      tripId: string;
    };
  };
};

export default function TripDetailsScreen({ route }: TripDetailsScreenProps) {
  const { tripId } = route.params;
  const { isDark } = useTheme();

  const FlightCard = ({
    title,
    airline,
    flightNumber,
    departureCity,
    departureAirport,
    departureTime,
    departureTimezone,
    departureDate,
    arrivalCity,
    arrivalAirport,
    arrivalTime,
    arrivalTimezone,
    arrivalDate,
    travelTime,
  }: {
    title: string;
    airline: string;
    flightNumber: string;
    departureCity: string;
    departureAirport: string;
    departureTime: string;
    departureTimezone: string;
    departureDate: string;
    arrivalCity: string;
    arrivalAirport: string;
    arrivalTime: string;
    arrivalTimezone: string;
    arrivalDate: string;
    travelTime: string;
  }) => (
    <View className="mb-4 rounded-2xl">
      <Text className="mb-4 text-sm font-medium text-muted-foreground">{title}</Text>

      {/* Airline & Flight Number */}

      {/* Flight Route */}
      <View className="mb-4 rounded-2xl bg-card p-4">
        <View className="mb-4 flex-row items-center">
          <View className="mr-3 h-8 w-8 rounded-full bg-blue-500" />
          <Text className="text-base font-semibold text-foreground">
            {airline} {flightNumber}
          </Text>
        </View>
        {/* Departure */}
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">{departureCity}</Text>
            <Text className="text-sm text-muted-foreground">{departureAirport}</Text>
          </View>
          <View className="items-end">
            <Text className="text-lg font-bold text-foreground">{departureTime}</Text>
            <Text className="text-xs text-muted-foreground">{departureTimezone}</Text>
            <Text className="text-xs text-muted-foreground">{departureDate}</Text>
          </View>
        </View>

        {/* Travel Time Line */}
        <View className="mb-3 items-center">
          <View className="h-16 w-0.5 bg-blue-500" />
          <Text className="mt-2 text-sm text-blue-500">Travel time: {travelTime}</Text>
        </View>

        {/* Arrival */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">{arrivalCity}</Text>
            <Text className="text-sm text-muted-foreground">{arrivalAirport}</Text>
          </View>
          <View className="items-end">
            <Text className="text-lg font-bold text-foreground">{arrivalTime}</Text>
            <Text className="text-xs text-muted-foreground">{arrivalTimezone}</Text>
            <Text className="text-xs text-muted-foreground">{arrivalDate}</Text>
          </View>
        </View>
      </View>

      {/* Flight Details */}
      <View className="mb-4">
        <View className="mb-2 flex-row justify-between">
          <Text className="text-sm text-muted-foreground">Aircraft</Text>
          <Text className="text-sm text-foreground">{tripId}</Text>
        </View>
        <View className="mb-2 flex-row justify-between">
          <Text className="text-sm text-muted-foreground">Cabin</Text>
          <Text className="text-sm text-foreground">Economy</Text>
        </View>
        <View className="mb-2 flex-row justify-between">
          <Text className="text-sm text-muted-foreground">Distance</Text>
          <Text className="text-sm text-foreground">3083 mi</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="mr-2 text-sm text-muted-foreground">Emissions</Text>
            <Ionicons name="information-circle" size={16} color={isDark ? "#9ca3af" : "#6b7280"} />
          </View>
          <View className="rounded-full bg-green-500 px-3 py-1">
            <Text className="text-xs font-medium text-white">Below average CO₂</Text>
          </View>
        </View>
      </View>

      {/* Amenities */}
      <View>
        <Text className="mb-3 text-sm font-medium text-foreground">Amenities</Text>
        <View className="mb-2 flex-row items-center">
          <Ionicons name="wifi" size={16} color={isDark ? "#9ca3af" : "#6b7280"} />
          <Text className="ml-2 text-sm text-foreground">WiFi</Text>
        </View>
        <View className="mb-2 flex-row items-center">
          <Ionicons name="flash" size={16} color={isDark ? "#9ca3af" : "#6b7280"} />
          <Text className="ml-2 text-sm text-foreground">In-seat power outlet</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="play-circle" size={16} color={isDark ? "#9ca3af" : "#6b7280"} />
          <Text className="ml-2 text-sm text-foreground">In-flight entertainment</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeContainer
      header={{
        title: "Flight details",
        showBackButton: true,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={true} className="flex-1 px-6 py-6">
        {/* Flight 1 of 2 */}
        <FlightCard
          title="Flight 1 of 2"
          airline="Turkish Airlines"
          flightNumber="TK571"
          departureCity="Nouakchott"
          departureAirport="Nouakchott Intl. (NKC)"
          departureTime="9:40am"
          departureTimezone="GMT"
          departureDate="Mon, Sep 15"
          arrivalCity="Istanbul"
          arrivalAirport="Istanbul Airport (IST)"
          arrivalTime="7:10pm"
          arrivalTimezone="TRT"
          arrivalDate="Mon, Sep 15"
          travelTime="6h 30m"
        />

        {/* Layover */}
        <View className="mb-4 flex-row items-center justify-center">
          <View className="mr-2 h-px flex-1 bg-border" />
          <View className="flex-row items-center">
            <Ionicons name="time" size={16} color={isDark ? "#9ca3af" : "#6b7280"} />
            <Text className="ml-2 text-sm text-muted-foreground">1h 50m layover in Istanbul</Text>
          </View>
          <View className="ml-2 h-px flex-1 bg-border" />
        </View>

        {/* Flight 2 of 2 */}
        <FlightCard
          title="Flight 2 of 2"
          airline="Turkish Airlines"
          flightNumber="TK758"
          departureCity="Istanbul"
          departureAirport="Istanbul Airport (IST)"
          departureTime="9:00pm"
          departureTimezone="TRT"
          departureDate="Mon, Sep 15"
          arrivalCity="Destination"
          arrivalAirport="Destination Airport"
          arrivalTime="9:00pm"
          arrivalTimezone="TRT"
          arrivalDate="Mon, Sep 15"
          travelTime="4h 30m"
        />

        {/* See Fares Button */}
        <TouchableOpacity className="mb-6 mt-4 rounded-xl bg-blue-500 py-4">
          <Text className="text-center text-lg font-semibold text-white">See fares</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeContainer>
  );
}
