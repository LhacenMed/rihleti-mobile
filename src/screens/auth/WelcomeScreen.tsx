// import React, { useRef, useMemo, useCallback } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

// interface Props {
//   navigation: any;
// }

// const WelcomeScreen = ({ navigation }: Props) => {
//   // BottomSheet ref
//   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

//   // Callbacks - addressing missing handlers from roadmap
//   const handlePresentModalPress = useCallback(() => {
//     bottomSheetModalRef.current?.present();
//   }, []);

//   // const handleSheetChanges = useCallback((index: number) => {
//   //   console.log("handleSheetChanges", index);
//   // }, []);

//   // const handleDismiss = useCallback(() => {
//   //   console.log("Bottom sheet dismissed");
//   // }, []);

//   // Render backdrop
//   const renderBackdrop = useCallback(
//     (props: any) => (
//       <BottomSheetBackdrop
//         {...props}
//         disappearsOnIndex={-1}
//         appearsOnIndex={0}
//         opacity={0.5}
//         enableTouchThrough={false}
//       />
//     ),
//     []
//   );

//   return (
//     <View className="flex-1 bg-[#fefae0]">
//       <View className="flex-1 items-center justify-center p-5">
//         <Text className="mb-2 text-center text-4xl font-bold text-black">Welcome to Rihleti</Text>
//         <Text className="mb-15 text-center text-lg text-gray-600">Your travel companion app</Text>

//         <View className="mb-15">
//           <Text className="text-center text-8xl py-8">✈️</Text>
//         </View>

//         <View className="w-full gap-4">
//           <TouchableOpacity
//             className="items-center rounded-lg bg-[#606c38] py-4"
//             onPress={() => navigation.navigate("Login")}
//           >
//             <Text className="text-lg font-semibold text-white">Sign In</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="items-center rounded-lg border-2 border-[#606c38] bg-transparent py-4"
//             onPress={() => navigation.navigate("SignUp")}
//           >
//             <Text className="text-lg font-semibold text-[#606c38]">Create Account</Text>
//           </TouchableOpacity>

//           {/* Bottom Sheet Trigger Button */}
//           <TouchableOpacity
//             className="mt-2 items-center rounded-lg bg-transparent py-3"
//             onPress={handlePresentModalPress}
//           >
//             <Text className="text-base font-medium text-[#606c38] underline">Learn More</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Bottom Sheet Modal */}
//       <BottomSheetModal
//         ref={bottomSheetModalRef}
//         // onChange={handleSheetChanges}
//         // onDismiss={handleDismiss}
//         enableDismissOnClose={true}
//         backdropComponent={renderBackdrop}
//       >
//         <BottomSheetView className="flex-1 items-center p-6">
//           <Text className="mb-4 text-center text-2xl font-bold text-black">About Rihleti ✈️</Text>
//           <Text className="mb-4 text-center text-base leading-6 text-gray-600">
//             Rihleti is your ultimate travel companion, designed to make your journeys seamless and
//             memorable.
//           </Text>
//           <Text className="mb-4 text-center text-base leading-6 text-gray-600">
//             • Plan your trips with ease{"\n"}• Discover hidden gems{"\n"}• Connect with fellow
//             travelers{"\n"}• Track your adventures
//           </Text>
//           <TouchableOpacity
//             className="mt-4 rounded-lg bg-[#606c38] px-6 py-3"
//             onPress={() => {
//               bottomSheetModalRef.current?.dismiss();
//               navigation.navigate("SignUp");
//             }}
//           >
//             <Text className="text-base font-semibold text-white">Get Started</Text>
//           </TouchableOpacity>
//         </BottomSheetView>
//       </BottomSheetModal>
//     </View>
//   );
// };

// export default WelcomeScreen;



import React, { useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

interface Props {
  navigation: any;
}

const { height } = Dimensions.get("window");

export default function WelcomeScreen({ navigation }: Props) {
  // BottomSheet ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Callbacks - addressing missing handlers from roadmap
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log("handleSheetChanges", index);
  // }, []);

  // const handleDismiss = useCallback(() => {
  //   console.log("Bottom sheet dismissed");
  // }, []);

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        enableTouchThrough={false}
      />
    ),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Cancel Button */}
      <View className="absolute right-4 top-12 z-10">
        <TouchableOpacity>
          <Text className="text-base font-medium text-white">Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1">
        {/* Top Half - Background Image */}
        <View className="relative flex-1">
          <Image
            source={{
              uri: "https://ieasxblluboxxzobeznz.supabase.co/storage/v1/object/public/images/logos/p1to0gr3pse-1754095383333.jpg",
            }}
            className="h-full w-full"
            resizeMode="cover"
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)", "#000000"]}
            locations={[0, 0.6, 0.8, 1]}
            className="absolute inset-0"
          />
        </View>

        {/* Logo Section */}
        <View className="absolute bottom-80 left-0 right-0 z-10 items-center">
          {/* Logo Icon */}
          <View className="mb-4">
            <View className="h-12 w-12 items-center justify-center">
              <View className="relative h-8 w-8">
                {/* Perplexity Logo - Simplified geometric design */}
                <View className="absolute inset-0 rotate-45 transform border-2 border-white" />
                <View className="absolute bottom-1 left-1 right-1 top-1 -rotate-45 transform border border-white" />
                <View className="absolute bottom-2 left-2 right-2 top-2 rotate-45 transform bg-white" />
              </View>
            </View>
          </View>

          {/* Brand Name */}
          <Text className="text-3xl font-light tracking-wide text-white">rihleti</Text>
        </View>

        {/* Bottom Half - Authentication Buttons */}
        <View className="bg-black px-6 pb-8 pt-4">
          {/* Google Button */}
          <TouchableOpacity className="mb-4 flex-row items-center justify-center rounded-full bg-white px-6 py-4">
            <Text className="ml-2 text-base font-medium text-black">Continue with Google</Text>
          </TouchableOpacity>

          {/* Email Button */}
          <TouchableOpacity className="mb-4 rounded-full bg-gray-800 px-6 py-4" onPress={() => navigation.navigate("Login")}>
            <Text className="text-center text-base font-medium text-white">
              Continue with Email
            </Text>
          </TouchableOpacity>

          {/* SSO Button */}
          <TouchableOpacity className="mb-8 rounded-full bg-gray-800 px-6 py-4">
            <Text className="text-center text-base font-medium text-white">Continue with SSO</Text>
          </TouchableOpacity>

          {/* Footer Links */}
          <View className="mb-4 flex-row justify-center gap-8 space-x-8">
            <TouchableOpacity onPress={handlePresentModalPress}>
              <Text className="text-sm text-gray-400">Privacy policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePresentModalPress}>
              <Text className="text-sm text-gray-400">Terms of service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Bottom Sheet Modal */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        // onChange={handleSheetChanges}
        // onDismiss={handleDismiss}
        enableDismissOnClose={true}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex-1 items-center p-6">
          <Text className="mb-4 text-center text-2xl font-bold text-black">About Rihleti ✈️</Text>
          <Text className="mb-4 text-center text-base leading-6 text-gray-600">
            Rihleti is your ultimate travel companion, designed to make your journeys seamless and
            memorable.
          </Text>
          <Text className="mb-4 text-center text-base leading-6 text-gray-600">
            • Plan your trips with ease{"\n"}• Discover hidden gems{"\n"}• Connect with fellow
            travelers{"\n"}• Track your adventures
          </Text>
          <TouchableOpacity
            className="mt-4 rounded-lg bg-[#606c38] px-6 py-3"
            onPress={() => {
              bottomSheetModalRef.current?.dismiss();
              navigation.navigate("SignUp");
            }}
          >
            <Text className="text-base font-semibold text-white">Get Started</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
