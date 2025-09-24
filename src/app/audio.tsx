import { useAudioPlayer } from "expo-audio";
import { Button, Alert, View, Text } from "react-native";
import { File, Paths } from "expo-file-system";
import { Asset } from "expo-asset";
import * as MediaLibrary from "expo-media-library";
import SafeContainer from "@/components/SafeContainer";

export default function AudioPlayerExample() {
  const player = useAudioPlayer(require("../assets/audios/lust.mp3"));

  const saveAudioToDevice = async () => {
    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant media library permission to save files.", [
          { text: "OK" },
        ]);
        return;
      }

      // Get the asset info for the bundled audio file
      const asset = Asset.fromModule(require("../assets/audios/lust.mp3"));
      await asset.downloadAsync();

      const tempFile = new File(Paths.document, "Lust.mp3");

      // Copy the asset to temporary location
      if (asset.localUri) {
        const sourceFile = new File(asset.localUri);
        sourceFile.copy(tempFile);
      } else {
        await File.downloadFileAsync(asset.uri, tempFile);
      }

      // Save to media library (this makes it accessible in Music/Audio apps)
      const savedAsset = await MediaLibrary.createAssetAsync(tempFile.uri);
      Alert.alert("Success!", `The file now can be found in your device's music library.`, [
        { text: "OK" },
      ]);

      // Clean up temporary files from cache
      try {
        // Delete the temporary file we created
        if (tempFile.exists) {
          tempFile.delete();
          console.log("Temporary file cleaned up:", tempFile.uri);
        }

        // Also clean up any cached asset files
        if (asset.localUri && asset.localUri.includes("ExponentAsset")) {
          const assetCacheFile = new File(asset.localUri);
          if (assetCacheFile.exists) {
            assetCacheFile.delete();
            console.log("Asset cache file cleaned up:", asset.localUri);
          }
        }

        // Clean up any other temporary audio files in cache directory
        try {
          const cacheAudioFile = new File(Paths.cache, "lust.mp3");
          if (cacheAudioFile.exists) {
            cacheAudioFile.delete();
            console.log("Cache audio file cleaned up");
          }
        } catch (cacheCleanupError) {
          console.log(
            "Cache cleanup note:",
            cacheCleanupError instanceof Error
              ? cacheCleanupError.message
              : String(cacheCleanupError)
          );
        }
      } catch (deleteError) {
        console.log(
          "Note: Could not clean up some cache files:",
          deleteError instanceof Error ? deleteError.message : String(deleteError)
        );
        // Don't show this error to user as cleanup is not critical for functionality
      }
    } catch (error) {
      console.error("Error saving audio file:", error);
      Alert.alert(
        "Error",
        `Failed to save audio file: ${error instanceof Error ? error.message : String(error)}`,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeContainer className="px-4" header={{ title: "Audio" }}>
      <View style={{ gap: 20, paddingTop: 20 }}>
        {/* Audio Player Section */}
        <View style={{ gap: 10 }}>
          <Text className="text-3xl text-foreground">Audio Player</Text>
          <Button title="Play" onPress={() => player.play()} />
          <Button
            title="Replay"
            onPress={() => {
              player.seekTo(0);
              player.play();
            }}
          />
          <Button title="Save Audio to Device" onPress={saveAudioToDevice} color="blue" />
        </View>
      </View>
    </SafeContainer>
  );
}
