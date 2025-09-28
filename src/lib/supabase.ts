import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
// import { getEnv } from "expo-env";

// const supabaseUrl = getEnv("SUPABASE_URL");
// const supabaseAnonKey = getEnv("SUPABASE_ANON_KEY");

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please check your app.config.js file.");
}

// Avoid accessing AsyncStorage in non-RN environments (e.g., Node during export)
const isReactNative = typeof navigator !== "undefined" && (navigator as any).product === "ReactNative";
const storage = isReactNative ? AsyncStorage : undefined;
const persist = !!isReactNative;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: persist,
    persistSession: persist,
    detectSessionInUrl: false,
  },
});
