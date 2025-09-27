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
            output: "server",
        },

        experiments: {
            tsconfigPaths: true,
        },

        plugins: [
            [
                "expo-localization",
                {
                    locationAlwaysAndWhenInUsePermission: "Allow Rihleti to use your location.",
                },
            ],
            "expo-font",
            "expo-asset", ["expo-router", { origin: "https://rihleti.vercel.app" }],
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
            // [
            //     "react-native-audio-api",
            //     {
            //         iosBackgroundMode: true,
            //         iosMicrophonePermission: "This app requires access to the microphone to record audio.",
            //         androidPermissions: [
            //             "android.permission.MODIFY_AUDIO_SETTINGS",
            //             "android.permission.FOREGROUND_SERVICE",
            //             "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
            //         ],
            //         androidForegroundService: true,
            //         androidFSTypes: ["mediaPlayback"],
            //     },
            // ],
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
            infoPlist: {
                UIBackgroundModes: ["audio"],
            },
        },

        android: {
            adaptiveIcon: {
                foregroundImage: "./src/assets/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
            package: "com.rihleti.app",
            edgeToEdgeEnabled: true,
            // Explicitly request mic permission to guarantee it in native manifests
            permissions: ["RECORD_AUDIO"],
            notification: {
                icon: "./src/assets/notification-icon.png",
                color: "#84cc16",
                androidMode: "default",
            },
        },

        extra: {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
            supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE_KEY,
            streamApiKey: process.env.STREAM_API_KEY,
            streamApiSecret: process.env.STREAM_API_SECRET,
            // eas: {
            //     projectId: "6943ba63-1c3c-445f-8702-6f99899439b5",
            // },
            // eas: {
            //     projectId: "fc452bc0-0445-447b-a43b-416976fdaa69", //lhacenmed4
            // },
            // eas: {
            //     projectId: "dad1c25f-1072-47ef-87db-0f8164e1e933", //lhacenmed5
            // },
            eas: {
                projectId: "9d8e1608-1c32-409b-b2ca-62a58688bd77", //lhacenmed6
            },
        },
    },
};