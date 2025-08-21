import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
//@ts-ignore
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface Props {
  navigation: any;
}

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContactUs = () => {
    Alert.alert("Contact Us", "Contact functionality to be implemented");
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Forgot password functionality to be implemented");
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pb-8 pt-12">
          <TouchableOpacity onPress={handleBack} className="p-2">
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleContactUs}>
            <Text className="text-lg font-medium text-white">Contact us</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 px-6">
          {/* Title */}
          <View className="mb-20 mt-16">
            <Text className="text-center text-3xl font-medium leading-tight text-white">
              Log in with password
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Email Input */}
            <View>
              <Input
                placeholder="Email / +86 Phone number"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                containerClassName=""
              />
            </View>

            {/* Password Input */}
            <View>
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                isPassword={true}
                containerClassName=""
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} className="pb-8 pt-2">
              <Text className="text-lg font-medium text-blue-400">Forgot password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              className={`items-center rounded-xl bg-blue-500 py-6 ${loading ? "opacity-70" : ""}`}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-lg font-semibold text-white">
                {loading ? "Logging in..." : "Log in"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Home Indicator */}
        <View className="items-center pb-2">
          <View className="h-1 w-32 rounded-full bg-white opacity-60" />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
