import { Stack } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-xl font-bold">This screen doesn't exist.</Text>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="mt-4 py-2 px-4 bg-blue-500 rounded"
        >
          <Text className="text-white">Go to home screen</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
