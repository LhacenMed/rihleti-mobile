import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";

export default function TripsScreen() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    if (!departure.trim() || !destination.trim()) {
      Alert.alert("Error", "Please enter both departure and destination locations");
      return;
    }
    
    router.push(`/(app)/trips/${encodeURIComponent(departure.trim())}/${encodeURIComponent(destination.trim())}`);
  };

  return (
    <View className="flex-1 bg-background p-4">
      <View className="mt-10">
        <Text className="text-2xl font-bold text-foreground mb-6">Find Trips</Text>
        
        <View className="mb-4">
          <Text className="text-foreground mb-2">Departure</Text>
          <TextInput
            className="border border-border rounded-lg p-3 bg-card text-foreground"
            placeholder="Enter departure location"
            value={departure}
            onChangeText={setDeparture}
            placeholderTextColor="#999"
          />
        </View>
        
        <View className="mb-6">
          <Text className="text-foreground mb-2">Destination</Text>
          <TextInput
            className="border border-border rounded-lg p-3 bg-card text-foreground"
            placeholder="Enter destination location"
            value={destination}
            onChangeText={setDestination}
            placeholderTextColor="#999"
          />
        </View>
        
        <TouchableOpacity
          className="bg-primary rounded-lg p-4 items-center"
          onPress={handleSearch}
        >
          <Text className="text-primary-foreground font-medium">Search Trips</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}