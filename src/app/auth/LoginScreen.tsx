import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { Input } from "~/components/ui/input";

interface Props {
  navigation?: any;
}

const EmailInputScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPasswordScreen, setShowPasswordScreen] = useState<boolean>(false);

  const keyboard = useAnimatedKeyboard();

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.max(40, keyboard.height.value + 20),
  }));

  const handleContinue = (): void => {
    // Handle continue logic here
    console.log("Email:", email);
    if (showPasswordScreen) {
      console.log("Password:", password);
    }
  };

  const handleLoginWithPassword = (): void => {
    // Show password screen
    setShowPasswordScreen(true);
  };

  const handleLoginWithEmail = (): void => {
    // Handle login with email logic here
    setShowPasswordScreen(false);
  };

  const handleBackPress = (): void => {
    // Handle back navigation
    if (showPasswordScreen) {
      setShowPasswordScreen(false);
    } else if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
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
                // secureTextEntry={!showPassword}
                isPassword
                autoCapitalize="none"
                autoCorrect={false}
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
              (!email || (showPasswordScreen && !password)) && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!email || (showPasswordScreen && !password)}
          >
            <Text
              style={[
                styles.continueButtonText,
                (!email || (showPasswordScreen && !password)) && styles.continueButtonTextDisabled,
              ]}
            >
              Continue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={showPasswordScreen ? handleLoginWithEmail : handleLoginWithPassword}
          >
            <Text style={styles.loginButtonText}>
              {showPasswordScreen ? "Log in with email" : "Log in with password"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeAreaContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 16,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 18,
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
