import React from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useAuth } from "@contexts/AuthContext";
import { showModal } from "@whitespectre/rn-modal-presenter";
import Modal from "@/components/ui/modal";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

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

const Page = ({ navigation }: RouterProps) => {
  const { signOut } = useAuth();

  const navigateToSplash = () => {
    navigation.navigate("Splash");
  };
  const navigateToWelcomeScreen = () => {
    navigation.navigate("WelcomeScreen");
  };
  const navigateToLoginScreenTest = () => {
    navigation.navigate("LoginScreenTest");
  };
  const navigateToSettingsScreenTest = () => {
    navigation.navigate("SettingsTest");
  };
  const navigateToTrips = () => {
    navigation.navigate("TripsScreen");
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
      navigation.reset({
        index: 0,
        routes: [{ name: "WelcomeScreen" }],
      });
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const showLogoutConfirmation = () => {
    showLogoutModal(handleLogout);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-5">
        <Text className="mb-4 text-lg text-foreground">Explore Screen</Text>
        <Button onPress={navigateToTrips} title="View My Trips" />
        <Button onPress={navigateToSplash} title="Open splash" />
        <Button onPress={navigateToWelcomeScreen} title="Open welcome screen" />
        <Button onPress={navigateToLoginScreenTest} title="Open Login screen (test)" />
        <Button onPress={navigateToSettingsScreenTest} title="Open Settings screen (test)" />
        <TouchableOpacity
          onPress={clearOnboarding}
          className="mb-12 mt-12 rounded-md bg-destructive p-3"
        >
          <Text className="text-center text-destructive-foreground">Clear Onboarding</Text>
        </TouchableOpacity>
        <Button onPress={showLogoutConfirmation} title="Logout" />
        <Button onPress={showLogoutConfirmation} title="Open Modal" />
      </View>
    </View>
  );
};

export default Page;
