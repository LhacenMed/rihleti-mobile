import React, { useState, useCallback, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetTextInput } from "@gorhom/bottom-sheet";

interface EmailBottomSheetProps {
  onEmailSubmit: (email: string) => void;
  title?: string;
  placeholder?: string;
  buttonText?: string;
}

const EmailBottomSheet = forwardRef<BottomSheetModal, EmailBottomSheetProps>(
  (
    {
      onEmailSubmit,
      title = "Enter your email",
      placeholder = "Enter your email address",
      buttonText = "Continue",
    },
    ref
  ) => {
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);

    // Email validation
    const validateEmail = useCallback((emailText: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(emailText);
    }, []);

    const handleEmailChange = useCallback(
      (text: string) => {
        setEmail(text);
        setIsValidEmail(validateEmail(text));
      },
      [validateEmail]
    );

    const handleContinue = useCallback(() => {
      if (isValidEmail) {
        onEmailSubmit(email);
        setEmail(""); // Reset email after submit
      }
    }, [email, isValidEmail, onEmailSubmit]);

    // Render backdrop
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          enableTouchThrough={false}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        enableDismissOnClose={true}
        backdropComponent={renderBackdrop}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
      >
        <View className="flex-1">
          <BottomSheetView className="flex-1 px-6 py-8">
            <Text className="mb-6 text-center text-2xl font-bold text-black">{title}</Text>

            <View className="mb-6">
              <TextInput
                className={`rounded-lg border px-4 py-4 text-base ${
                  email.length > 0
                    ? isValidEmail
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
              />
              <BottomSheetTextInput value="Awesome 🎉" />
              {email.length > 0 && !isValidEmail && (
                <Text className="mt-2 text-sm text-red-500">
                  Please enter a valid email address
                </Text>
              )}
            </View>

            <TouchableOpacity
              className={`rounded-lg px-6 py-4 ${isValidEmail ? "bg-[#606c38]" : "bg-gray-300"}`}
              onPress={handleContinue}
              disabled={!isValidEmail}
            >
              <Text
                className={`text-center text-base font-semibold ${
                  isValidEmail ? "text-white" : "text-gray-500"
                }`}
              >
                {buttonText}
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  textInput: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "grey",
    color: "white",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

EmailBottomSheet.displayName = "EmailBottomSheet";

export default EmailBottomSheet;
