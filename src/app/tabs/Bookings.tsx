import { ScrollView, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeDemo } from "../../components/ThemeDemo";

const Bookings = () => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="p-4">
        <Text className="mb-6 text-center text-2xl font-bold text-foreground">Bookings Screen</Text>

        <View className="mb-6 rounded-lg border border-border bg-card p-4">
          <Text className="text-card-foreground text-base">
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
