import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  // StatusBar,
  // SafeAreaView,
  // TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import {
  BottomSheetModal,
  // BottomSheetView,
  // BottomSheetBackdrop,
  // TouchableHighlight,
} from "@gorhom/bottom-sheet";
import EmailBottomSheet from "@/components/blocks/email-bottom-sheet";
import { Button } from "@/components/ui/button";
import { GoogleLogo, RihletiLogo } from "@/components/icons";
// import { Ionicons } from "@expo/vector-icons";
import SafeContainer from "@/components/SafeContainer";
import { useAnimatedKeyboard } from "react-native-reanimated";

import { router } from "expo-router";

const LinkText = ({ children, onPress }: { children: React.ReactNode; onPress: () => void }) => {
  const [pressed, setPressed] = useState(false);
  const keyboard = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  });

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      <Text className={`text-sm underline ${pressed ? "text-primary/50" : "text-primary"}`}>
        {children}
      </Text>
    </Pressable>
  );
};

export default function WelcomeScreen() {
  const emailBottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentEmailModal = useCallback(() => {
    emailBottomSheetRef.current?.present();
  }, []);

  const handleEmailSubmit = useCallback((email: string) => {
    console.log("Email submitted:", email);
    emailBottomSheetRef.current?.dismiss();
    // Navigate to next screen or handle email submission
    router.push({
      pathname: "/(auth)/signup",
      params: { email },
    });
  }, []);

  return (
    <SafeContainer>
      {/* Contact us Button */}
      <View className="absolute right-4 top-0">
        <TouchableOpacity
          onPress={() => {
            router.push("/(app)/settings-test");
          }}
        >
          <Text className="text-base font-medium text-muted-foreground">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content - Centered Layout */}
      <View className="flex-1 items-center justify-center">
        <RihletiLogo size={250} />
      </View>

      {/* Bottom Authentication Buttons */}
      <View className="px-6 pb-12">
        {/* Sign up free Button */}
        <View className="mb-4">
          <Button variant="default" onPress={() => router.push("/(auth)/signup")}>
            <Text className="text-md text-white">Sign up free</Text>
          </Button>
        </View>

        {/* Continue with Google Button */}
        <View className="mb-4">
          <Button variant="outline" onPress={handlePresentEmailModal} textClassName="text-white">
            <GoogleLogo size={20} />
            <Text className="text-md ml-4 text-foreground">Continue with Google</Text>
          </Button>
        </View>

        {/* Continue with email Button */}
        <View className="mb-8">
          <Button
            variant="outline"
            onPress={() => router.push("/(auth)/login")}
            textClassName="text-white"
          >
            <Text className="text-md ml-4 text-foreground">Continue with email</Text>
          </Button>
        </View>

        {/* Terms and Privacy Policy */}
        <View className="items-center justify-center px-4">
          <View className="flex-row flex-wrap justify-center">
            <Text className="text-center text-sm leading-5 text-gray-400">
              I confirm that I have read and agree to Rihleti's{" "}
            </Text>
            <LinkText
              onPress={() =>
                router.push({
                  pathname: "/webview",
                  params: {
                    link: "https://rihleti.vercel.app/legal/terms-of-service",
                    title: "Terms of Use",
                  },
                })
              }
            >
              Terms of Use
            </LinkText>
            <Text className="text-center text-sm leading-5 text-gray-400"> and </Text>
            <LinkText
              onPress={() =>
                router.push({
                  pathname: "/webview",
                  params: {
                    link: "https://rihleti.vercel.app/legal/privacy-policy",
                    title: "Privacy Policy",
                  },
                })
              }
            >
              Privacy Policy
            </LinkText>
          </View>
        </View>
      </View>

      {/* Email Bottom Sheet Modal */}
      <EmailBottomSheet
        ref={emailBottomSheetRef}
        onEmailSubmit={handleEmailSubmit}
        title="Continue with Email"
        placeholder="Enter your email address"
        buttonText="Continue"
      />
    </SafeContainer>
  );
}
