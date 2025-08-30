import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Alert } from "react-native";
import MenuItem, { MenuGroup } from "@components/MenuItem";
import { useTheme } from "@contexts/ThemeContext";
import { useAuth } from "@contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { showModal } from "@whitespectre/rn-modal-presenter";
import Modal from "@components/ui/modal";
import * as Haptic from "expo-haptics";
import Constants from "expo-constants";

const Settings = () => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { isDark } = useTheme();
  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  const backgroundColor = isDark ? "#171717" : "rgb(249, 249, 249)";

  const navigateToAccount = () => {
    navigation.navigate("Account" as never);
  };

  const navigateToPreferences = () => {
    navigation.navigate("Preferences" as never);
  };

  const handleLogout = async () => {
    const handleSignOut = async () => {
      setLogoutLoading(true);
      try {
        await signOut();
      } catch (error) {
        console.error("Error during logout", error);
      } finally {
        setLogoutLoading(false);
      }
    };

    if (Platform.OS === "ios") {
      // Use native iOS Alert
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
      Alert.alert(
        "Confirm log out?",
        "Logging out won't delete any data. You can sign back into this account anytime.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign Out",
            style: "destructive",
            onPress: handleSignOut,
          },
        ],
        { cancelable: true }
      );
    } else {
      // Use custom modal component for Android
      showModal(Modal, {
        title: "Confirm log out?",
        subtitle: "Logging out won't delete any data. You can sign back into this account anytime.",
        buttons: [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign Out",
            style: "destructive",
            onPress: handleSignOut,
          },
        ],
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={[styles.scrollViewContainer, { backgroundColor }]}
        contentContainerStyle={{ paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        // scrollEnabled
      >
        {/* Theme Section */}
        <View className="mb-8 px-4">
          <ThemeSwitcher />
        </View>

        {/* Profile Section */}
        <MenuGroup title="Profile">
          <MenuItem
            icon="mail-outline"
            title="Email"
            value={user?.email}
            isFirst
            isLast={false}
            showValue
            showChevron
            onPress={navigateToAccount}
          />
          <MenuItem
            icon="logo-google"
            title="Google"
            value={user?.app_metadata.providers?.includes("google") ? "Connected" : "Disconnected"}
            isFirst={false}
            isLast
            showValue
            showChevron={false}
            disabled
          />
        </MenuGroup>
        {/* About Section */}
        <MenuGroup title="About">
          <MenuItem icon="document-text-outline" title="Terms of Use" isFirst isLast={false} />
          <MenuItem
            icon="shield-outline"
            title="Privacy Policy"
            value=""
            isFirst={false}
            isLast={false}
            showValue={true}
            showChevron={true}
          />
          <MenuItem
            icon="information-circle-outline"
            title="Check for Updates"
            value={Constants.expoConfig?.version || "1.0.0"}
            isFirst={false}
            isLast
            showValue={true}
            showChevron={true}
          />
        </MenuGroup>
        {/* App Section */}
        <MenuGroup title="App">
          <MenuItem
            icon="options-outline"
            title="Preferences"
            // value="Controls"
            isFirst
            isLast={false}
            showValue={true}
            showChevron={true}
            onPress={navigateToPreferences}
          />
          <MenuItem
            icon={isDark ? "moon-outline" : "sunny-outline"}
            title="Color Scheme"
            value={isDark ? "Dark" : "Light"}
            isLast={false}
            showValue={true}
            showChevron={true}
            // onPress={() => setModalVisible(true)}
          />
          <MenuItem
            icon="earth"
            title="App Language"
            value="English"
            isFirst={false}
            isLast
            showValue={true}
            showChevron={true}
            // onPress={() => setLanguageModalVisible(true)}
          />
        </MenuGroup>
        {/* Contact Section */}
        <MenuGroup containerStyle={styles.miniSection}>
          <MenuItem icon="chatbubble-outline" title="Contact Us" isFirst isLast />
        </MenuGroup>
        {/* Danger Zone */}
        <MenuGroup containerStyle={styles.miniSection}>
          <MenuItem
            icon="log-out-outline"
            title="Log Out"
            isDanger
            isFirst
            showChevron={false}
            onPress={handleLogout}
            loading={logoutLoading}
          />
          <MenuItem
            icon="person-remove-outline"
            title="Delete Account"
            isDanger
            isLast
            showChevron={false}
          />
        </MenuGroup>
        <Text style={[styles.footerText, { color: "#666666" }]}>
          Version {Constants.expoConfig?.version || "1.0.0"}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 5,
    backgroundColor: "#171717",
    zIndex: 1,
    elevation: 3,
  },
  headerLeftContainer: {
    width: 28,
    alignItems: "flex-start",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerRightContainer: {
    width: 28,
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  miniSection: {
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  scrollViewContainer: {
    flex: 1,
  },
});

export default Settings;
