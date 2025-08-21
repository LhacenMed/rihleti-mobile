import React, { useRef, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, StatusBar, SafeAreaView } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  TouchableHighlight,
} from "@gorhom/bottom-sheet";
import EmailBottomSheet from "../../components/EmailBottomSheet";
import { Button } from "../../components/ui/button";
import { RihletiLogo } from "../../components/icons";

interface Props {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: Props) {
  // BottomSheet refs
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const emailBottomSheetRef = useRef<BottomSheetModal>(null);

  // Callbacks - addressing missing handlers from roadmap
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePresentEmailModal = useCallback(() => {
    emailBottomSheetRef.current?.present();
  }, []);

  const handleEmailSubmit = useCallback(
    (email: string) => {
      console.log("Email submitted:", email);
      emailBottomSheetRef.current?.dismiss();
      // Navigate to next screen or handle email submission
      navigation.navigate("SignUp", { email });
    },
    [navigation]
  );

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

      {/* Contact us Button */}
      <View className="absolute right-4 top-12 z-10">
        <TouchableOpacity>
          <Text className="text-base font-medium text-gray-400">Contact us</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content - Centered Layout */}
      <View className="flex-1 items-center justify-center">
        <RihletiLogo size={250} />
      </View>

      {/* Bottom Authentication Buttons */}
      <View className="px-6 pb-12">
        {/* Continue with Password Button */}
        <View className="mb-4">
          <Button
            variant="default"
            size="primary"
            onPress={() => navigation.navigate("Login")}
            className="bg-white"
          >
            🔒 Continue with Password
          </Button>
        </View>

        {/* Continue with Google Button */}
        <View className="mb-4">
          <Button
            variant="outline"
            size="primary"
            className="border-gray-600 bg-gray-800"
            onPress={handlePresentEmailModal}
            textClassName="text-white"
          >
            G Continue with Google
          </Button>
        </View>

        {/* Sign up Button */}
        <View className="mb-8">
          <Button
            variant="outline"
            size="primary"
            onPress={() => navigation.navigate("SignUp")}
            className="border-gray-600 bg-gray-800"
            textClassName="text-white"
          >
            Sign up
          </Button>
        </View>

        {/* Terms and Privacy Policy */}
        <View className="flex-row items-center justify-center">
          <TouchableHighlight onPress={handlePresentModalPress}>
            <Text className="text-center text-sm text-gray-400">
              I confirm that I have read and agree to Rihleti's{" "}
              <Text className="underline">Terms of Use</Text> and{" "}
              <Text className="underline">Privacy Policy</Text>
            </Text>
          </TouchableHighlight>
        </View>
      </View>

      {/* About Bottom Sheet Modal */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
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

      {/* Email Bottom Sheet Modal */}
      <EmailBottomSheet
        ref={emailBottomSheetRef}
        onEmailSubmit={handleEmailSubmit}
        title="Continue with Email"
        placeholder="Enter your email address"
        buttonText="Continue"
      />
    </SafeAreaView>
  );
}
