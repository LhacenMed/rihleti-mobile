import { ScrollView, Text, View, TouchableOpacity, Button } from "react-native";
import React from "react";
import { ThemeDemo } from "@/components/ThemeDemo";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SafeContainer from "@/components/SafeContainer";

const Bookings = () => {
  // const router = useRouter();

  const navigateToSettingsScreenTest = () => {
    router.push("/settings-test");
  };

  return (
    <SafeContainer style={{ paddingTop: 0 }}>
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
            onPress={() => router.push("/(app)/chat")}
          >
            <Ionicons name="chatbubbles-outline" size={24} color="#64748b" />
            <Text className="ml-3 text-lg text-foreground">Messages</Text>
            <View className="ml-auto h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Text className="text-xs font-bold text-primary-foreground">2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="mb-6 flex-row items-center rounded-lg border border-border bg-card p-4"
            onPress={() => router.push("/(app)/new-chat")}
          >
            <Ionicons name="add" size={24} color="#64748b" />
            <Text className="ml-3 text-lg text-foreground">Add new chat</Text>
          </TouchableOpacity>
          <Button onPress={navigateToSettingsScreenTest} title="Open Settings screen (test)" />
          <ThemeDemo />
        </View>
      </ScrollView>
    </SafeContainer>
  );
};

export default Bookings;
