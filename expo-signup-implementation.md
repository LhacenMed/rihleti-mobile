# Expo React Native Signup Flow Implementation

This guide shows how to implement a signup flow similar to the web version in an Expo React Native app, using the deployed API endpoints from `https://rihleti.vercel.app/`.

## Prerequisites

- Expo React Native project set up
- Supabase configuration completed
- Auth stack implemented

## 1. Install Required Dependencies

```bash
npm install @supabase/supabase-js react-hook-form @hookform/resolvers zod react-native-toast-message @react-native-async-storage/async-storage
```

## 2. Create Validation Schemas

Create `utils/validation.ts`:

```typescript
import * as z from "zod";

const passwordSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });

export const signupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: passwordSchema,
});

export const verifyOtpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp: z.string().min(6, { message: "OTP must be 6 digits" }),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
```

## 3. Create Auth Helper Functions

Create `utils/auth-helpers.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase'; // Your existing supabase config
import Toast from 'react-native-toast-message';

const API_BASE_URL = 'https://rihleti.vercel.app';

interface EmailVerificationResult {
  is_deliverable: boolean;
  is_disposable: boolean;
  status: string;
}

// Email verification using the deployed API
export async function verifyEmail(email: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reoon?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to verify email');
    }

    const data: EmailVerificationResult = await response.json();

    if (!data.is_deliverable) {
      return { isValid: false, error: 'This email address appears to be invalid or undeliverable.' };
    }

    if (data.is_disposable) {
      return { isValid: false, error: 'Disposable email addresses are not allowed.' };
    }

    if (data.status !== 'safe') {
      return { isValid: false, error: 'This email address appears to be risky or invalid.' };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Email verification error:', error);
    return { isValid: false, error: 'Failed to verify email address. Please try again.' };
  }
}

// Send verification email using the deployed API
export async function sendVerificationEmail(email: string, password: string): Promise<{ success: boolean; tokenData?: any; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'verification',
        email,
        password,
        isPasswordReset: false,
        origin: API_BASE_URL, // Important for proper redirect URLs
      }),
    });

    const responseData = await response.json();
    
    if (!response.ok || responseData.error) {
      throw new Error(
        typeof responseData.error === 'string'
          ? responseData.error
          : responseData.error?.message || 'Failed to send verification email'
      );
    }

    return { success: true, tokenData: responseData.tokenData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup';
    return { success: false, error: errorMessage };
  }
}

// Verify OTP using the deployed API
export async function verifyOtp(email: string, otp: string, name: string): Promise<{ success: boolean; error?: string }> {
  // Input validation
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Invalid email format' };
  }
  if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
    return { success: false, error: 'Invalid verification code format' };
  }

  try {
    // Use your existing Supabase client to verify OTP
    const { data, error } = await supabase.auth.verifyOtp({
      token: otp,
      email,
      type: 'signup',
    });

    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error('User ID not found');

    // Update user metadata using the deployed API
    const updateResponse = await fetch(`${API_BASE_URL}/api/auth/update-user-metadata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        metadata: {
          role: 'agency', // Default role
          name,
          onboarded: false,
          email_verified: true,
          phone_verified: false,
        },
      }),
    });

    const result = await updateResponse.json();
    if (!updateResponse.ok) {
      throw new Error(result.error || 'Failed to update user metadata');
    }

    // Clear stored verification data
    await AsyncStorage.removeItem('verificationEmail');
    await AsyncStorage.removeItem('verificationTokenData');
    
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Verification failed';
    return { success: false, error: errorMessage };
  }
}
```

## 4. Create the Signup Screen Component

Create `screens/SignupScreen.tsx`:

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { signupSchema, SignupFormData } from '../utils/validation';
import { verifyEmail, sendVerificationEmail } from '../utils/auth-helpers';

interface SignupScreenProps {
  navigation: any; // Replace with proper navigation type
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [email, setEmail] = useState('');

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    
    try {
      // Step 1: Verify email
      const emailVerification = await verifyEmail(data.email);
      if (!emailVerification.isValid) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Email',
          text2: emailVerification.error,
        });
        return;
      }

      // Step 2: Send verification email
      const verificationResult = await sendVerificationEmail(data.email, data.password);
      if (!verificationResult.success) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: verificationResult.error,
        });
        return;
      }

      // Step 3: Store verification data and navigate to OTP screen
      await AsyncStorage.setItem('verificationEmail', data.email);
      await AsyncStorage.setItem('signupName', data.name);
      if (verificationResult.tokenData) {
        await AsyncStorage.setItem('verificationTokenData', JSON.stringify(verificationResult.tokenData));
      }

      setEmail(data.email);
      setShowVerification(true);
      
      Toast.show({
        type: 'success',
        text1: 'Verification Email Sent',
        text2: 'Please check your email for the verification code',
      });

      // Navigate to OTP verification screen
      navigation.navigate('VerifyOTP', { 
        email: data.email,
        name: data.name 
      });

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.title}>Create Account</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                />
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your password"
                  secureTextEntry
                />
              )}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, (!isValid || loading) && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Continue with Email'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  },
  linkTextBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
```

## 5. Create the OTP Verification Screen

Create `screens/VerifyOTPScreen.tsx`:

```typescript
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { verifyOtp } from '../utils/auth-helpers';

interface VerifyOTPScreenProps {
  route: {
    params: {
      email: string;
      name: string;
    };
  };
  navigation: any;
}

export default function VerifyOTPScreen({ route, navigation }: VerifyOTPScreenProps) {
  const { email, name } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter the complete 6-digit code',
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await verifyOtp(email, otpString, name);
      
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Account Created',
          text2: 'Your account has been successfully verified',
        });
        
        // Navigate to your app's main flow (e.g., onboarding or dashboard)
        navigation.navigate('Onboarding'); // or wherever you want to navigate
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: result.error,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      handleVerifyOtp();
    }
  }, [otp]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{'\n'}{email}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref!)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
              editable={!loading}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerifyOtp}
          disabled={loading || otp.join('').length !== 6}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.editButtonText}>Edit Email Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    alignItems: 'center',
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

## 6. Navigation Setup

Add these screens to your navigation stack:

```typescript
// In your navigation stack
<Stack.Screen name="Signup" component={SignupScreen} />
<Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
```

## 7. Configure Toast Messages

In your main App component, add:

```typescript
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
      {/* Your app navigation */}
      <Toast />
    </>
  );
}
```

## Key Differences from Web Version

1. **AsyncStorage** instead of sessionStorage
2. **Navigation** between screens instead of conditional rendering
3. **React Native components** instead of HTML elements
4. **Toast messages** instead of custom toast component
5. **Manual OTP input handling** instead of specialized OTP component

## Process Flow

1. User fills signup form → **Validates inputs**
2. **Calls deployed email verification API** (`/api/reoon`)
3. **Calls deployed email sending API** (`/api/resend`)
4. **Navigates to OTP screen** with email/name params
5. User enters OTP → **Verifies with Supabase**
6. **Calls deployed metadata update API** (`/api/auth/update-user-metadata`)
7. **Navigates to onboarding/dashboard**

## API Endpoints Used

- `GET /api/reoon?email=${email}` - Email verification
- `POST /api/resend` - Send verification email with OTP
- `POST /api/auth/update-user-metadata` - Update user metadata after verification

## Security Features

- Email deliverability validation
- Disposable email detection
- Password strength requirements
- OTP verification through Supabase
- Input validation and sanitization
- Error handling and user feedback

This implementation reuses all the backend logic from your deployed app while adapting the frontend for React Native! 