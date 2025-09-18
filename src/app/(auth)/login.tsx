import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { Input } from "@/components/ui/input";
import SafeContainer from "@/components/SafeContainer";
// import { supabase } from "@/lib/supabase";
import { verifyEmail, loginWithEmail } from "@/utils/auth-helpers";
import Button from "@/components/ui/button";
import * as z from "zod";
import { useTheme } from "@/contexts/ThemeContext";

import { router } from "expo-router";

// Login validation schemas
const emailSchema = z.email({ message: "Invalid email address" });
const passwordSchema = z.string().min(1, { message: "Password is required" });

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPasswordScreen, setShowPasswordScreen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { isDark } = useTheme();

  const keyboard = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.max(40, keyboard.height.value + (Platform.OS === "android" ? 20 : 0)),
  }));

  // Login with email and password
  const handleLogin = async (): Promise<void> => {
    setLoading(true);

    try {
      // Validate inputs
      emailSchema.parse(email);
      passwordSchema.parse(password);

      // Use the login helper which handles Supabase + Stream token
      const { success, error } = await loginWithEmail(email, password);

      if (!success) {
        Alert.alert("Login Failed", error || "Unknown error");
        return;
      }

      // Navigate to the main app/home screen
      router.push("/(app)/(tabs)"); // replace with your actual home route
    } catch (err) {
      if (err instanceof z.ZodError) {
        Alert.alert("Validation Error", err.message);
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
        console.error(err);
      }
    } finally {
      await new Promise((r) => setTimeout(r, 1000));
      setLoading(false);
    }
  };

  // Send OTP email (structure prepared)
  const handleSendOTP = async (): Promise<void> => {
    setLoading(true);

    try {
      // Validate email
      emailSchema.parse(email);

      // Verify email deliverability
      const emailVerification = await verifyEmail(email);
      if (!emailVerification.isValid) {
        Alert.alert("Invalid Email", emailVerification.error || "Email is not valid");
        return;
      }

      // TODO: Implement OTP sending logic here
      // This will call your sendVerificationEmail function
      console.log("Send OTP to:", email);

      // Navigate to OTP verification screen
      router.push({
        pathname: "/(auth)/verify-otp",
        params: { email },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        Alert.alert("Validation Error", error.message);
      } else {
        Alert.alert("Error", "Failed to send verification code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = (): void => {
    if (showPasswordScreen) {
      handleLogin();
    } else {
      handleSendOTP();
    }
  };

  const handleLoginWithPassword = (): void => {
    setShowPasswordScreen(true);
  };

  const handleLoginWithEmail = (): void => {
    setShowPasswordScreen(false);
  };

  const handleBackPress = (): void => {
    if (showPasswordScreen) {
      setShowPasswordScreen(false);
    } else {
      router.back();
    }
  };

  const isFormValid = email && (showPasswordScreen ? password : true);

  return (
    <SafeContainer>
      {/* Header with back button */}
      <View className="px-4 pb-4 pt-2">
        <TouchableOpacity
          onPress={handleBackPress}
          className="h-11 w-11 items-start justify-center"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View className="flex-1 px-6 pt-2.5">
        <Text className="mb-6 py-[2px] text-3xl font-bold text-foreground">
          {showPasswordScreen ? "Log in to Rihleti" : "What's your email?"}
        </Text>

        <Input
          placeholder="Email address"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          autoFocus
          autoComplete="email"
        />

        {showPasswordScreen && (
          <Input
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            isPassword
            autoCapitalize="sentences"
            editable={!loading}
          />
        )}

        {!showPasswordScreen && (
          <Text className="text-md mt-2 text-muted-foreground">
            We'll send you a confirmation code.
          </Text>
        )}
      </View>

      {/* Bottom buttons */}
      <Animated.View style={animatedStyle} className="gap-4 px-6">
        <Button
          variant="default"
          textStyle={[{ fontSize: 16, fontWeight: "600" }]}
          className={`items-center justify-center border-transparent bg-secondary`}
          textClassName={`text-base font-semibold py-[2px]`}
          onPress={handleContinue}
          disabled={!isFormValid || loading}
          loading={loading}
        >
          Continue
        </Button>

        <Button
          variant="outline"
          textStyle={{ fontSize: 16 }}
          className="items-center border-[#333]"
          textClassName="text-base font-semibold text-muted-foreground py-[2px]"
          onPress={showPasswordScreen ? handleLoginWithEmail : handleLoginWithPassword}
          disabled={loading}
        >
          {showPasswordScreen ? "Log in with email" : "Log in with password"}
        </Button>
      </Animated.View>
    </SafeContainer>
  );
};

export default LoginScreen;
