import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, TextInputProps } from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "@gorhom/bottom-sheet";

interface PasswordRequirement {
  label: string;
  met: boolean;
  regex?: RegExp;
  check?: (password: string) => boolean;
}

export interface InputProps extends Omit<TextInputProps, "secureTextEntry"> {
  error?: boolean;
  errorMessage?: string;
  validationError?: string;
  isLoading?: boolean;
  submitted?: boolean;
  passwordRequirements?: PasswordRequirement[];
  isPassword?: boolean;
  actionIcon?: React.ReactNode;
  onActionPress?: () => void;
  containerClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      error,
      errorMessage,
      validationError,
      isLoading,
      submitted,
      passwordRequirements,
      isPassword = false,
      actionIcon,
      onActionPress,
      containerClassName = "",
      inputClassName = "",
      errorClassName = "",
      onFocus,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [hasBeenFocused, setHasBeenFocused] = useState(false);
    const [requirementsMet, setRequirementsMet] = useState(false);
    const lottieRef = useRef<LottieView>(null);

    // Track requirements met state
    useEffect(() => {
      if (passwordRequirements) {
        const allMet = passwordRequirements.every((req) => req.met);
        if (!requirementsMet && allMet) {
          // Requirements just became met
        }
        setRequirementsMet(allMet);
      }
    }, [passwordRequirements, requirementsMet]);

    // Handle toggle password visibility with animation
    const togglePasswordVisibility = () => {
      if (!isPassword || !lottieRef.current) return;

      setShowPassword(!showPassword);

      if (showPassword) {
        // Play animation from frame 60 to 0 (closing eye)
        lottieRef.current.play(60, 0);
      } else {
        // Play animation from frame 0 to 60 (opening eye)
        lottieRef.current.play(0, 60);
      }
    };

    const handleFocus = (e: any) => {
      if (!hasBeenFocused) {
        setHasBeenFocused(true);
      }
      onFocus?.(e);
    };

    const shouldShowPasswordRequirements =
      isPassword && passwordRequirements && hasBeenFocused && !submitted;

    return (
      <View className={`${containerClassName}`}>
        <View className="relative">
          <TextInput
            ref={ref}
            secureTextEntry={isPassword ? !showPassword : false}
            className={`mb-3 overflow-hidden rounded-lg border border-border bg-transparent px-4 py-3 text-base text-foreground ${
              error ? "border border-red-500" : ""
            } ${actionIcon || isPassword ? "pr-16" : ""} ${inputClassName}`}
            placeholderTextColor="#6B7280"
            onFocus={handleFocus}
            style={{ fontSize: 16 }}
            {...props}
          />

          {/* Right side icons */}
          <View
            className="absolute right-4 flex-row items-center space-x-2"
            style={{
              top: "50%",
              transform: [{ translateY: -17 }],
            }}
          >
            {/* Error icon */}
            {error && (
              <TouchableOpacity>
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}

            {/* Password requirements indicator */}
            {shouldShowPasswordRequirements && (
              <TouchableOpacity>
                <View
                  className={`h-5 w-5 items-center justify-center rounded-full border ${
                    requirementsMet
                      ? "border-green-500 bg-green-100"
                      : "border-yellow-500 bg-yellow-100"
                  }`}
                >
                  {requirementsMet ? (
                    <Ionicons name="checkmark" size={12} color="#10B981" />
                  ) : (
                    <Ionicons name="warning" size={12} color="#F59E0B" />
                  )}
                </View>
              </TouchableOpacity>
            )}

            {/* Password visibility toggle */}
            {isPassword ? (
              <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
                <View
                  className="items-center justify-center rounded-md border border-border bg-background"
                  style={{
                    width: 35,
                    height: 24,
                  }}
                >
                  <LottieView
                    ref={lottieRef}
                    source={require("@/assets/lottie/eye-icon-light.json")}
                    style={{
                      width: 35,
                      height: 35,
                      transform: [{ translateY: -1 }],
                    }}
                    loop={false}
                    autoPlay={false}
                    speed={5}
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : isLoading ? (
              <View className="animate-spin">
                <Ionicons name="refresh" size={16} color="#6B7280" />
              </View>
            ) : (
              actionIcon &&
              onActionPress && (
                <TouchableOpacity
                  onPress={onActionPress}
                  className="rounded-md border border-zinc-600 bg-zinc-700 p-1"
                  style={{ width: 32, height: 24 }}
                >
                  {actionIcon}
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Validation error */}
        {validationError && (
          <View className={`mt-1 ${errorClassName}`}>
            <Text className="text-sm text-red-500">{validationError}</Text>
          </View>
        )}

        {/* Password requirements */}
        {shouldShowPasswordRequirements && (
          <View className="mt-2 rounded-lg border border-zinc-700 bg-zinc-800 p-3">
            <Text className="mb-2 text-sm font-medium text-white">Password must contain:</Text>
            {passwordRequirements.map((requirement, index) => (
              <View key={index} className="mb-1 flex-row items-center space-x-2">
                <View
                  className={`h-4 w-4 items-center justify-center rounded-full border ${
                    requirement.met ? "border-green-500" : "border-zinc-500"
                  }`}
                >
                  {requirement.met && <Ionicons name="checkmark" size={10} color="#10B981" />}
                </View>
                <Text
                  className={`text-sm ${
                    requirement.met ? "text-green-400 line-through" : "text-zinc-400"
                  }`}
                >
                  {requirement.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

export { Input };
