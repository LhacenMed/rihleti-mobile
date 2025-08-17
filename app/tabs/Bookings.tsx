import { Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Bookings = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <Text className="text-xl text-white">Bookings Screen</Text>
    </View>
  );
};

export default Bookings;
