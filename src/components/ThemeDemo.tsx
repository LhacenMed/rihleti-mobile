import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export function ThemeDemo() {
  const { isDark } = useTheme();

  return (
    <View className="p-4">
      <Text className="mb-4 text-xl font-bold text-foreground">Theme Demo</Text>

      {/* Core Colors Demo */}
      <View className="mb-6">
        <Text className="mb-3 text-lg font-semibold text-foreground">Core Colors</Text>

        {/* Background & Foreground */}
        <View className="mb-2 rounded-lg border border-border bg-background p-3">
          <Text className="text-foreground">Background with Foreground text</Text>
        </View>

        {/* Card */}
        <View className="mb-2 rounded-lg border border-border bg-card p-3">
          <Text className="text-card-foreground mb-1 font-medium">Card Component</Text>
          <Text className="text-muted-foreground text-sm">This is a card with muted text</Text>
        </View>
      </View>

      {/* Brand Colors Demo */}
      <View className="mb-6">
        <Text className="mb-3 text-lg font-semibold text-foreground">Brand Colors</Text>

        <View className="mb-2 flex-row gap-2">
          <TouchableOpacity className="flex-1 rounded-md bg-primary px-4 py-2">
            <Text className="text-primary-foreground text-center font-medium">Primary</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 rounded-md border border-border bg-secondary px-4 py-2">
            <Text className="text-secondary-foreground text-center font-medium">Secondary</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="bg-accent mb-2 rounded-md px-4 py-2">
          <Text className="text-accent-foreground text-center font-medium">Accent Button</Text>
        </TouchableOpacity>
      </View>

      {/* State Colors Demo */}
      <View className="mb-6">
        <Text className="mb-3 text-lg font-semibold text-foreground">State Colors</Text>

        <View className="mb-2 flex-row gap-2">
          <TouchableOpacity className="flex-1 rounded-md bg-success px-3 py-2">
            <Text className="text-success-foreground text-center text-sm font-medium">Success</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 rounded-md bg-warning px-3 py-2">
            <Text className="text-warning-foreground text-center text-sm font-medium">Warning</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-destructive flex-1 rounded-md px-3 py-2">
            <Text className="text-destructive-foreground text-center text-sm font-medium">
              Error
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Input Demo */}
      <View className="mb-6">
        <Text className="mb-3 text-lg font-semibold text-foreground">Form Elements</Text>

        <TextInput
          className="border-input mb-2 rounded-md border bg-background px-3 py-2 text-foreground"
          placeholder="Enter some text..."
          placeholderTextColor={isDark ? "#999" : "#666"}
        />

        <TextInput
          className="text-card-foreground rounded-md border border-border bg-card px-3 py-2"
          placeholder="Another input field..."
          placeholderTextColor={isDark ? "#999" : "#666"}
        />
      </View>

      {/* Custom App Colors Demo */}
      <View className="mb-6">
        <Text className="mb-3 text-lg font-semibold text-foreground">Custom App Colors</Text>

        <Text className="text-muted-foreground mb-2 text-sm">Seat Types:</Text>
        <View className="flex-row gap-2">
          <View className="bg-seat-window h-12 w-12 items-center justify-center rounded-lg">
            <Text className="text-xs font-medium text-white">W</Text>
          </View>
          <View className="bg-seat-aisle h-12 w-12 items-center justify-center rounded-lg">
            <Text className="text-xs font-medium text-white">A</Text>
          </View>
          <View className="bg-seat-middle h-12 w-12 items-center justify-center rounded-lg">
            <Text className="text-xs font-medium text-black">M</Text>
          </View>
        </View>
      </View>

      {/* Border Radius Demo */}
      <View className="mb-6">
        <Text className="mb-3 text-lg font-semibold text-foreground">Border Radius</Text>

        <View className="flex-row gap-2">
          <View className="flex-1 rounded-sm bg-primary p-2">
            <Text className="text-primary-foreground text-center text-xs">Small</Text>
          </View>
          <View className="flex-1 rounded-md bg-primary p-2">
            <Text className="text-primary-foreground text-center text-xs">Medium</Text>
          </View>
          <View className="flex-1 rounded-lg bg-primary p-2">
            <Text className="text-primary-foreground text-center text-xs">Large</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
