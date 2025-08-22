import { ScrollView, Text, View } from "react-native";
import React from "react";
import { ThemeDemo } from "../../components/ThemeDemo";

const Bookings = () => {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <View className="mb-6 rounded-lg border border-border bg-card p-4">
          <Text className="text-base text-card-foreground">
            This screen demonstrates the new theme system in action. Switch themes in the Settings
            tab to see all components automatically adapt!
          </Text>
        </View>

        <ThemeDemo />
      </View>
    </ScrollView>
  );
};

export default Bookings;
