import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { ThemeSwitcher } from "@components/ThemeSwitcher";
import { useTheme } from "@contexts/ThemeContext";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  const navigateToAccount = () => {
    navigation.navigate("Account" as never);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-5">
        {/* Theme Section */}
        <View className="mb-8">
          <Text className="mb-4 px-1 text-lg font-semibold text-foreground">Appearance</Text>
          <View className="mb-2 rounded-xl border border-border bg-card p-4">
            <View className="mb-3 flex-row items-center">
              <Ionicons name="color-palette-outline" size={24} color={isDark ? "#fff" : "#000"} />
              <Text className="ml-4 text-base font-medium text-card-foreground">Theme</Text>
            </View>
            <ThemeSwitcher />
          </View>
        </View>

        {/* Account Section */}
        <View className="mb-8">
          <Text className="mb-4 px-1 text-lg font-semibold text-foreground">Account</Text>
          <TouchableOpacity
            className="mb-2 flex-row items-center justify-between rounded-xl border border-border bg-card p-4"
            onPress={navigateToAccount}
          >
            <View className="flex-1 flex-row items-center">
              <Ionicons name="person-outline" size={24} color={isDark ? "#fff" : "#000"} />
              <View className="ml-4 flex-1">
                <Text className="mb-1 text-base font-medium text-card-foreground">
                  Account Details
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {user?.email || "View your account information"}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? "#999" : "#666"} />
          </TouchableOpacity>
        </View>

        {/* App Settings Section */}
        <View className="mb-8">
          <Text className="mb-4 px-1 text-lg font-semibold text-foreground">App Settings</Text>

          <TouchableOpacity className="mb-2 flex-row items-center justify-between rounded-xl border border-border bg-card p-4">
            <View className="flex-1 flex-row items-center">
              <Ionicons name="notifications-outline" size={24} color={isDark ? "#fff" : "#000"} />
              <View className="ml-4 flex-1">
                <Text className="mb-1 text-base font-medium text-card-foreground">
                  Notifications
                </Text>
                <Text className="text-sm text-muted-foreground">
                  Manage your notification preferences
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? "#999" : "#666"} />
          </TouchableOpacity>

          <TouchableOpacity className="mb-2 flex-row items-center justify-between rounded-xl border border-border bg-card p-4">
            <View className="flex-1 flex-row items-center">
              <Ionicons name="shield-outline" size={24} color={isDark ? "#fff" : "#000"} />
              <View className="ml-4 flex-1">
                <Text className="mb-1 text-base font-medium text-card-foreground">
                  Privacy & Security
                </Text>
                <Text className="text-sm text-muted-foreground">Manage your privacy settings</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? "#999" : "#666"} />
          </TouchableOpacity>

          <TouchableOpacity className="mb-2 flex-row items-center justify-between rounded-xl border border-border bg-card p-4">
            <View className="flex-1 flex-row items-center">
              <Ionicons name="language-outline" size={24} color={isDark ? "#fff" : "#000"} />
              <View className="ml-4 flex-1">
                <Text className="mb-1 text-base font-medium text-card-foreground">Language</Text>
                <Text className="text-sm text-muted-foreground">English</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? "#999" : "#666"} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View className="mb-8">
          <Text className="mb-4 px-1 text-lg font-semibold text-foreground">Support</Text>

          <TouchableOpacity className="mb-2 flex-row items-center justify-between rounded-xl border border-border bg-card p-4">
            <View className="flex-1 flex-row items-center">
              <Ionicons name="help-circle-outline" size={24} color={isDark ? "#fff" : "#000"} />
              <View className="ml-4 flex-1">
                <Text className="mb-1 text-base font-medium text-card-foreground">Help Center</Text>
                <Text className="text-sm text-muted-foreground">Get help and support</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? "#999" : "#666"} />
          </TouchableOpacity>

          <TouchableOpacity className="mb-2 flex-row items-center justify-between rounded-xl border border-border bg-card p-4">
            <View className="flex-1 flex-row items-center">
              <Ionicons name="mail-outline" size={24} color={isDark ? "#fff" : "#000"} />
              <View className="ml-4 flex-1">
                <Text className="mb-1 text-base font-medium text-card-foreground">Contact Us</Text>
                <Text className="text-sm text-muted-foreground">Send us a message</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? "#999" : "#666"} />
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View className="mb-8 mt-5">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl bg-destructive p-4"
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="ml-2 text-lg font-semibold text-destructive-foreground">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Version Section */}
        <View className="mb-8 items-center">
          <Text className="text-sm text-muted-foreground">Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Settings;
