import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { ThemeDemo } from "../../components/ThemeDemo";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Bookings = () => {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <View className="mb-6 rounded-lg border border-border bg-card p-4">
          <Text className="text-base text-card-foreground">
            This screen demonstrates the new theme system in action. Switch themes in the Settings
            tab to see all components automatically adapt!
          </Text>
        </View>

        <TouchableOpacity
          className="mb-6 flex-row items-center rounded-lg border border-border bg-card p-4"
          onPress={() => navigation.navigate("Messages")}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#64748b" />
          <Text className="ml-3 text-lg text-foreground">Messages</Text>
          <View className="ml-auto h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Text className="text-xs font-bold text-primary-foreground">2</Text>
          </View>
        </TouchableOpacity>

        <ThemeDemo />
      </View>
    </ScrollView>
  );
};

export default Bookings;
