import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { Input } from "~/components/ui/input";
import SafeContainer from "~/components/SafeContainer";
import { supabase } from "~/lib/supabase";
import { verifyEmail } from "~/utils/auth-helpers";
import Loader from "~/components/ui/loader";
import * as z from "zod";

interface Props {
  navigation?: any;
}

// Login validation schemas
const emailSchema = z.string().email({ message: "Invalid email address" });
const passwordSchema = z.string().min(1, { message: "Password is required" });

const EmailInputScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPasswordScreen, setShowPasswordScreen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const keyboard = useAnimatedKeyboard();

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.max(
      40,
      keyboard.height.value + (Platform.OS === "android" ? 20 : 0)
    ),
  }));

  // Login with email and password
  const handleLogin = async (): Promise<void> => {
    setLoading(true);

    try {
      // Validate inputs
      emailSchema.parse(email);
      passwordSchema.parse(password);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login Failed", error.message);
        return;
      }

      // Navigation will be handled by auth context
    } catch (error) {
      if (error instanceof z.ZodError) {
        Alert.alert("Validation Error", error.message);
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    } finally {
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
      // navigation?.navigate("VerifyOTP", { email });
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
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const isFormValid = email && (showPasswordScreen ? password : true);

  return (
    <SafeContainer>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          {showPasswordScreen ? "Log in to Rihleti" : "What's your email?"}
        </Text>

        <View style={styles.inputContainer}>
          <Input
            style={styles.textInput}
            placeholder="Email address"
            placeholderTextColor="#666666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        {showPasswordScreen && (
          <View style={styles.inputContainer}>
            <Input
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#666666"
              value={password}
              onChangeText={setPassword}
              isPassword
              autoCapitalize="sentences"
              autoCorrect={false}
              editable={!loading}
            />
          </View>
        )}

        {!showPasswordScreen && (
          <Text style={styles.subtitle}>We'll send you a confirmation code.</Text>
        )}
      </View>

      {/* Bottom buttons */}
      <Animated.View style={[styles.bottomContainer, animatedStyle]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!isFormValid || loading) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <Loader />
          ) : (
            <Text
              style={[
                styles.continueButtonText,
                (!isFormValid || loading) && styles.continueButtonTextDisabled,
              ]}
            >
              Continue
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={showPasswordScreen ? handleLoginWithEmail : handleLoginWithPassword}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {showPasswordScreen ? "Log in with email" : "Log in with password"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 16,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  continueButton: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center", // Added to center the loader
    minHeight: 56, // Added minimum height to prevent button height changes
  },
  continueButtonDisabled: {
    backgroundColor: "#333333",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  continueButtonTextDisabled: {
    color: "#666666",
  },
  loginButton: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default EmailInputScreen;