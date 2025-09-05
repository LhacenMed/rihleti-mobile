import { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { verifyEmail, sendVerificationEmail } from "@/utils/auth-helpers";
import SafeContainer from "@/components/SafeContainer";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import * as z from "zod";

interface SignupScreenProps {
  navigation: any; // Replace with proper navigation type
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { isDark } = useTheme();

  const keyboard = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.max(40, keyboard.height.value + (Platform.OS === "android" ? 20 : 0)),
  }));

  // Validation schemas
  const nameSchema = z.string().min(1, { message: "Name is required" });
  const emailSchema = z.string().email({ message: "Invalid email address" });
  const passwordSchema = z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" });

  // Handle form submission
  const handleSignup = async (): Promise<void> => {
    setLoading(true);

    try {
      // Validate all inputs
      nameSchema.parse(name);
      emailSchema.parse(email);
      passwordSchema.parse(password);

      // Step 1: Verify email
      const emailVerification = await verifyEmail(email);
      if (!emailVerification.isValid) {
        Toast.show({
          type: "error",
          text1: "Invalid Email",
          text2: emailVerification.error,
        });
        return;
      }

      // Step 2: Send verification email
      const verificationResult = await sendVerificationEmail(email, password);
      if (!verificationResult.success) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: verificationResult.error,
        });
        return;
      }

      // Step 3: Store verification data and navigate to OTP screen
      await AsyncStorage.setItem("verificationEmail", email);
      await AsyncStorage.setItem("signupName", name);
      if (verificationResult.tokenData) {
        await AsyncStorage.setItem(
          "verificationTokenData",
          JSON.stringify(verificationResult.tokenData)
        );
      }

      Toast.show({
        type: "success",
        text1: "Verification Email Sent",
        text2: "Please check your email for the verification code",
      });

      // Navigate to OTP verification screen
      navigation.navigate("VerifyOTP", {
        email: email,
        name: name,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: firstError.message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error instanceof Error ? error.message : "An error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = (): void => {
    handleSignup();
  };

  const handleBackPress = (): void => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const isFormValid = name && email && password;

  return (
    <SafeContainer>
      {/* Header with back button */}
      <View className="px-4 pb-4 pt-2">
        <TouchableOpacity
          onPress={handleBackPress}
          className="h-11 w-11 items-start justify-center"
        >
          <Ionicons name="chevron-back" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View className="flex-1 px-6 pt-2.5">
        <Text className="mb-6 py-[2px] text-3xl font-bold text-foreground">
          Create your account
        </Text>

        <Input
          placeholder="Full name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          editable={!loading}
          autoFocus
          autoComplete="name"
        />

        <Input
          placeholder="Email address"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          autoComplete="email"
        />

        <Input
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          isPassword
          autoCapitalize="none"
          editable={!loading}
          // passwordRequirements={[
          //   { label: "At least 8 characters", met: password.length >= 8 },
          //   { label: "One uppercase letter", met: /[A-Z]/.test(password) },
          //   { label: "One lowercase letter", met: /[a-z]/.test(password) },
          //   { label: "One number", met: /[0-9]/.test(password) },
          // ]}
        />

        <Text className="text-md mt-2 text-muted-foreground">
          Password must be at least 8 characters with uppercase, lowercase, and numbers.
        </Text>
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
          Create Account
        </Button>
      </Animated.View>
    </SafeContainer>
  );
}

