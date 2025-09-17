import React from "react";
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  ToastAndroid,
  ToastAndroidStatic,
  // ProgressBarAndroid,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { showModal } from "@whitespectre/rn-modal-presenter";
import Modal from "@/components/ui/modal";
import * as Progress from "react-native-progress";
import SafeContainer from "@/components/SafeContainer";

// Helper function to show the logout confirmation modal
const showLogoutModal = (onConfirmLogout: () => void) => {
  return showModal(Modal, {
    children: (
      <View className="px-4 py-5">
        <Text className="mb-3 text-center text-lg font-semibold text-foreground">
          Confirm log out?
        </Text>
        <Text className="text-center text-sm leading-5 text-muted-foreground">
          Logging out won't delete any data. You can sign back into this account anytime.
        </Text>
      </View>
    ),
    buttons: [
      {
        text: "Cancel",
        // style: "cancel" as const,
      },
      // {
      //   text: "Log out",
      //   style: "destructive" as const,
      //   onPress: onConfirmLogout,
      // },
    ],
  });
};

const Explore = () => {
  // const router = useRouter();
  const { signOut } = useAuth();

  const navigateToSplash = () => {
    router.push("/(auth)/welcome");
  };
  const navigateToWelcomeScreen = () => {
    router.push("/(auth)/welcome");
  };
  const navigateToLoginScreenTest = () => {
    router.push("/(auth)/login");
  };
  const navigateToSettingsScreenTest = () => {
    router.push("/settings-test");
  };
  const navigateToRecording = () => {
    router.push("/recording");
  };
  const navigateToTrips = () => {
    router.push("/(app)/trips");
  };
  const clearOnboarding = async () => {
    try {
      // await AsyncStorage.removeItem("@viewedOnboarding");
    } catch (err) {
      console.log("Error @clearOnboarding: ", err);
    }
  };

  const handleLogout = async () => {
    try {
      // await FIREBASE_AUTH.signOut();
      // await AsyncStorage.setItem("@viewedOnboarding", "true");
      await signOut();
      router.replace("/(auth)/welcome");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const showLogoutConfirmation = () => {
    showLogoutModal(handleLogout);
  };

  const showToastAndroid = () => {
    ToastAndroid.show(
      "Hello world!, Hello world!, Hello world!, Hello world!, Hello world!, Hello world!, Hello world!, Hello world!, Hello world!, Hello world!",
      ToastAndroid.SHORT
    );
  };

  return (
    <SafeContainer
      header={{
        title: "Explore",
        // showBackButton: true,
        // rightComponent: <DropdownMenu items={items} onSelect={() => {}} />,
        // onBackPress: () => navigation.goBack(),
      }}
    >
      <View className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center p-5">
          <Text className="mb-4 text-lg text-foreground">Explore Screen</Text>
          <Button onPress={navigateToTrips} title="View My Trips" />
          <Button onPress={navigateToSplash} title="Open splash" />
          <Button onPress={navigateToWelcomeScreen} title="Open welcome screen" />
          <Button onPress={navigateToLoginScreenTest} title="Open Login screen (test)" />
          <Button onPress={navigateToSettingsScreenTest} title="Open Settings screen (test)" />
          <Button onPress={navigateToRecording} title="Open recording screen" />
          <Button onPress={showToastAndroid} title="Show android toast" />
          <TouchableOpacity
            onPress={clearOnboarding}
            className="mb-12 mt-12 rounded-md bg-destructive p-3"
          >
            <Text className="text-center text-destructive-foreground">Clear Onboarding</Text>
          </TouchableOpacity>
          <Button onPress={showLogoutConfirmation} title="Logout" />
          <Button onPress={showLogoutConfirmation} title="Open Modal" />
          {/* <ProgressBarAndroid styleAttr="Horizontal" indeterminate={true} /> */}
          <Progress.Bar indeterminate={true} width={200} />
          <Progress.Circle indeterminate={true} size={60} style={{ marginTop: 20 }} />
        </View>
      </View>
    </SafeContainer>
  );
};

export default Explore;
