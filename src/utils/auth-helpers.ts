import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import Toast from "react-native-toast-message";
import { StreamChat } from "stream-chat";
import Constants from "expo-constants";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://rihleti.vercel.app";
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseServiceRole = Constants.expoConfig?.extra?.supabaseServiceRole;
const streamApiKey = Constants.expoConfig?.extra?.streamApiKey;
const streamApiSecret = Constants.expoConfig?.extra?.streamApiSecret;

interface EmailVerificationResult {
  is_deliverable: boolean;
  is_disposable: boolean;
  status: string;
}

// Email verification
export async function verifyEmail(email: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reoon?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Failed to verify email");

    const data: EmailVerificationResult = await response.json();

    if (!data.is_deliverable) {
      return {
        isValid: false,
        error: "This email address appears to be invalid or undeliverable.",
      };
    }

    if (data.is_disposable) {
      return { isValid: false, error: "Disposable email addresses are not allowed." };
    }

    if (data.status !== "safe") {
      return { isValid: false, error: "This email address appears to be risky or invalid." };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Email verification error:", error);
    return { isValid: false, error: "Failed to verify email address. Please try again." };
  }
}

// Send verification email
export async function sendVerificationEmail(
  email: string,
  password: string
): Promise<{ success: boolean; tokenData?: any; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "verification",
        email,
        password,
        isPasswordReset: false,
        origin: API_BASE_URL,
      }),
    });

    const responseData = await response.json();

    if (!response.ok || responseData.error) {
      throw new Error(
        typeof responseData.error === "string"
          ? responseData.error
          : responseData.error?.message || "Failed to send verification email"
      );
    }

    return { success: true, tokenData: responseData.tokenData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred during signup";
    return { success: false, error: errorMessage };
  }
}

// Verify OTP, update metadata, and connect to Stream
export async function verifyOtp(
  email: string,
  otp: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Invalid email format" };
  }
  if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
    return { success: false, error: "Invalid verification code format" };
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token: otp,
      email,
      type: "signup",
    });

    if (error) throw error;
    const userId = data.user?.id;
    const accessToken = data.session?.access_token;
    if (!userId || !accessToken) throw new Error("User ID or session not found");

    // Update user metadata
    const updateResponse = await fetch(`${API_BASE_URL}/api/auth/update-user-metadata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        metadata: {
          role: "client",
          name,
          onboarded: false,
          email_verified: true,
          phone_verified: false,
        },
      }),
    });

    if (!updateResponse.ok) {
      const result = await updateResponse.json();
      throw new Error(result.error || "Failed to update user metadata");
    }

    // Fetch Stream token
    const streamResponse = await fetch("/api/stream-chat-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!streamResponse.ok) {
      throw new Error("Failed to fetch Stream token");
    }
    const { token, user } = await streamResponse.json();

    // Connect Stream client
    const client = StreamChat.getInstance(streamApiKey!);
    await client.connectUser({ id: user.id, name: user.name, image: user.avatar }, token);

    await AsyncStorage.removeItem("verificationEmail");
    await AsyncStorage.removeItem("verificationTokenData");

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Verification failed";
    return { success: false, error: errorMessage };
  }
}

// Login helper
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error("No access token returned");

    // Call Stream API route
    const streamResponse = await fetch("/api/stream-chat-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!streamResponse.ok) throw new Error("Failed to fetch Stream token");
    const { token, user } = await streamResponse.json();
    console.log("Stream token: ", token + ", User data: ", user)

    // Connect Stream client
    const client = StreamChat.getInstance(streamApiKey!);
    await client.connectUser({ id: user.id, name: user.name, image: user.avatar }, token);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    return { success: false, error: errorMessage };
  }
}
