module.exports = function(api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"
        ],
        plugins: [
            [
                "module-resolver",
                // "react-native-paper/babel",
                {
                    root: ["./src"],
                    alias: {
                        "@": ["./src"],
                        "@modules": ["./modules"],
                        "react-native-vector-icons": "@expo/vector-icons",
                    },
                },
            ],
            "react-native-worklets/plugin",
        ],
    };
};