import "dotenv/config";

export default {
    expo: {
        name: "Rihleti",
        slug: "rihleti",
        version: "1.0.0",

        web: {
            favicon: "./src/assets/favicon.png",
            bundler: "metro",
        },

        experiments: {
            tsconfigPaths: true,
        },

        plugins: [
            [
                "expo-localization",
                {
                    // Optional: customize permission messages
                    // locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location."
                }
            ]
        ],

        orientation: "portrait",
        icon: "./src/assets/icon.png",

        userInterfaceStyle: "automatic",

        splash: {
            image: "./src/assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },

        assetBundlePatterns: ["**/*"],

        ios: {
            supportsTablet: true,
        },

        android: {
            adaptiveIcon: {
                foregroundImage: "./src/assets/adaptive-icon.png",
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