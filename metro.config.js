const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
// const { wrapWithAudioAPIMetroConfig } = require("react-native-audio-api/metro-config");

const config = getDefaultConfig(__dirname, {
    // Enable CSS support
    isCSSEnabled: true,
});

// Add SVG transformer
const { transformer, resolver } = config;

config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
    platforms: ["ios", "android", "native", "web"],
    alias: {
        "@lottiefiles/dotlottie-react": require.resolve("@lottiefiles/dotlottie-react"),
    },
};

module.exports = withNativeWind(config, { input: "./global.css" });
// First apply NativeWind wrapper, then Audio API wrapper
// module.exports = wrapWithAudioAPIMetroConfig(withNativeWind(config, { input: "./global.css" }));