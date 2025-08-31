// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { TripWithRoute } from "../types/trips";
// import { formatTripTime, formatTripDate, formatPrice } from "../utils/trips-service";

// type TripCardProps = {
//   trip: TripWithRoute;
//   onPress: (trip: TripWithRoute) => void;
// };

// export default function TripCard({ trip, onPress }: TripCardProps) {
//   const { route, departure_time, arrival_time, price, origin, destination } = trip;

//   return (
//     <TouchableOpacity
//       onPress={() => onPress(trip)}
//       className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700"
//       activeOpacity={0.7}
//     >
//       {/* Route Info */}
//       <View className="mb-3">
//         <Text className="text-lg font-semibold text-black dark:text-white">
//           {origin?.address} → {destination?.address}
//         </Text>
//         {route?.name && route.name !== "undefined" && (
//           <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//             Route: {route.name}
//           </Text>
//         )}
//       </View>

//       {/* Time and Date */}
//       <View className="flex-row justify-between items-center mb-3">
//         <View className="flex-1">
//           <Text className="text-sm text-gray-600 dark:text-gray-400">Departure</Text>
//           <Text className="text-base font-medium text-black dark:text-white">
//             {formatTripTime(departure_time)}
//           </Text>
//           <Text className="text-xs text-gray-500 dark:text-gray-400">
//             {formatTripDate(departure_time)}
//           </Text>
//         </View>

//         {arrival_time && (
//           <View className="flex-1 items-end">
//             <Text className="text-sm text-gray-600 dark:text-gray-400">Arrival</Text>
//             <Text className="text-base font-medium text-black dark:text-white">
//               {formatTripTime(arrival_time)}
//             </Text>
//             <Text className="text-xs text-gray-500 dark:text-gray-400">
//               {formatTripDate(arrival_time)}
//             </Text>
//           </View>
//         )}
//       </View>

//       {/* Additional Info */}
//       <View className="flex-row justify-between items-center">
//         <View className="flex-row items-center">
//           {route?.distance_km && (
//             <Text className="text-sm text-gray-500 dark:text-gray-400 mr-4">
//               📍 {route.distance_km} km
//             </Text>
//           )}
//           {route?.duration && (
//             <Text className="text-sm text-gray-500 dark:text-gray-400">
//               ⏱️ {route.duration}
//             </Text>
//           )}
//         </View>

//         <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">
//           {formatPrice(price)}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TripWithRoute } from "@/types/trips";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

interface TripCardProps {
  departureTime: string;
  arrivalTime: string;
  departureCity: string;
  departureCode: string;
  arrivalCity: string;
  arrivalCode: string;
  airline: string;
  price: string;
  duration: string;
  stops: string;
  layoverDetails: string;
  trip: TripWithRoute;
  nextDay?: boolean;
  onPress: (trip: TripWithRoute) => void;
}

const TripCard: React.FC<TripCardProps> = ({
  departureTime = "T",
  arrivalTime = "T",
  departureCity = "T",
  departureCode = "T",
  arrivalCity = "T",
  arrivalCode = "T",
  airline = "T",
  price = "T",
  duration = "T",
  stops = "T",
  layoverDetails = "T",
  trip,
  nextDay = false,
  onPress,
}) => {
  const {isDark} = useTheme();
  return (
    <View className="py-2">
      <TouchableOpacity
        className="max-w-2xl rounded-2xl border border-border bg-card"
        activeOpacity={0.8}
        onPress={() => onPress(trip)}
      >
        {/* Top Section - Three Columns */}
        <View className="flex-row p-3">
          {/* Column 1: Logo */}
          <View className="mr-3">
            <Ionicons name="logo-apple" size={24} color={isDark ? "#fff" : "#000"} />
          </View>

          {/* Column 2: Flight Details */}
          <View className="flex-1">
            {/* Times */}
            <View className="mb-2 flex-row items-center gap-2">
              <Text className="text-lg font-semibold text-white">{departureTime} -</Text>
              {/* Stops visualized in a line with points */}
              {/* <View className="mx-3 flex-1 flex-row items-center">
                <View className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                <View className="mx-1 h-0.5 flex-1 bg-gray-500" />
                <View className="h-1.5 w-1.5 rounded-full bg-gray-500" /> 
                <View className="mx-1 h-0.5 flex-1 bg-gray-500" />
                <View className="h-1.5 w-1.5 rounded-full bg-gray-500" />
              </View> */}
              <View className="flex-row items-baseline">
                <Text className="text-lg font-semibold text-white">{arrivalTime}</Text>
                {nextDay && <Text className="ml-1 text-base font-medium text-red-400">+1</Text>}
              </View>
            </View>

            {/* Route */}
            <Text className="mb-2 text-xs text-gray-400">
              {departureCity} ({departureCode}) - {arrivalCity} ({arrivalCode})
            </Text>

            {/* Airline */}
            <Text className="mb-2 text-xs text-gray-400">{airline}</Text>

            {/* Duration and Stops */}
            <Text className="mb-1 text-xs font-semibold text-white">
              {duration} • {stops}
            </Text>

            {/* Layover Details */}
            <Text className="text-xs text-gray-400">{layoverDetails}</Text>
          </View>

          {/* Column 3: Price */}
          <View className="items-end">
            <Text className="mb-1 text-2xl font-bold text-white">{price}</Text>
            <Text className="text-xs text-gray-400">One way per traveler</Text>
          </View>
        </View>

        {/* Separator */}
        <View className="border-t border-border" />

        {/* Bottom Section */}
        <View className="flex-row justify-end p-3">
          <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(trip)}>
            <Text className="text-base font-medium text-blue-400">Trip details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TripCard;
