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
                        "@assets": ["./src/assets"],
                        "@components": ["./src/components"],
                        "@contexts": ["./src/contexts"],
                        "@lib": ["./src/lib"],
                        "@utils": ["./src/utils"],
                        "@screens": ["./src/screens"],
                        "@types": ["src/types"],
                    },
                },
            ],
        ],
    };
};