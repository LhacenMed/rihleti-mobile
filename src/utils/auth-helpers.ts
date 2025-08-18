import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import Toast from "react-native-toast-message";

const API_BASE_URL = "https://rihleti.vercel.app";

interface EmailVerificationResult {
  is_deliverable: boolean;
  is_disposable: boolean;
  status: string;
}

// Email verification using the deployed API
export async function verifyEmail(email: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reoon?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to verify email");
    }

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

// Send verification email using the deployed API
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
        origin: API_BASE_URL, // Important for proper redirect URLs
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

// Verify OTP using the deployed API
export async function verifyOtp(
  email: string,
  otp: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  // Input validation
  if (!email || !email.includes("@")) {
    return { success: false, error: "Invalid email format" };
  }
  if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
    return { success: false, error: "Invalid verification code format" };
  }

  try {
    // Use your existing Supabase client to verify OTP
    const { data, error } = await supabase.auth.verifyOtp({
      token: otp,
      email,
      type: "signup",
    });

    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("User ID not found");

    // Update user metadata using the deployed API
    const updateResponse = await fetch(`${API_BASE_URL}/api/auth/update-user-metadata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        metadata: {
          role: "client", // Default role
          name,
          onboarded: false,
          email_verified: true,
          phone_verified: false,
        },
      }),
    });

    const result = await updateResponse.json();
    if (!updateResponse.ok) {
      throw new Error(result.error || "Failed to update user metadata");
    }

    // Clear stored verification data
    await AsyncStorage.removeItem("verificationEmail");
    await AsyncStorage.removeItem("verificationTokenData");

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Verification failed";
    return { success: false, error: errorMessage };
  }
}
