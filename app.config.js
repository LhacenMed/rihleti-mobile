import "dotenv/config";

export default {
  expo: {
    name: "Rihleti",
    slug: "rihleti",
    version: "1.0.0",

    web: {
      favicon: "./assets/favicon.png",
    },

    experiments: {
      tsconfigPaths: true,
    },

    plugins: [],

    orientation: "portrait",
    icon: "./assets/icon.png",

    userInterfaceStyle: "light",

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },

    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: "your-eas-project-id", // Optional: for EAS builds
      },
    },
  },
};
