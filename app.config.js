import "dotenv/config";

export default {
    expo: {
        name: "Rihleti",
        slug: "rihleti",
        scheme: "rihleti",
        version: "1.0.2",

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
                    locationAlwaysAndWhenInUsePermission: "Allow Rihleti to use your location.",
                },
            ],
            "expo-font",
            "expo-asset",
            "expo-router",
            // "react-native-bottom-tabs",
            [
                "expo-build-properties",
                {
                    ios: {
                        useFrameworks: "static",
                    },
                },
            ],
            [
                "expo-audio",
                {
                    microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
                },
            ],
        ],

        orientation: "portrait",
        icon: "./src/assets/icon.png",

        userInterfaceStyle: "automatic",

        splash: {
            image: "./src/assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },

        notification: {
            icon: "./src/assets/notification-icon.png",
            color: "#84cc16",
            iosDisplayInForeground: true,
            androidMode: "default",
            androidCollapsedTitle: "Prayer Time",
        },

        assetBundlePatterns: ["**/*"],

        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.rihleti.app",
        },

        android: {
            adaptiveIcon: {
                foregroundImage: "./src/assets/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
            package: "com.rihleti.app",
            edgeToEdgeEnabled: true,
            notification: {
                icon: "./src/assets/notification-icon.png",
                color: "#84cc16",
                androidMode: "default",
            },
        },

        extra: {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
            // eas: {
            //     projectId: "6943ba63-1c3c-445f-8702-6f99899439b5",
            // },
            eas: {
                projectId: "fc452bc0-0445-447b-a43b-416976fdaa69",
            },
        },
    },
};