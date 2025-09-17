import { useEffect, useState } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
// import {
//   useAudioRecorder,
//   useAudioRecorderState,
//   RecordingPresets,
//   setAudioModeAsync,
//   requestRecordingPermissionsAsync,
//   useAudioPlayer,
// } from "expo-audio";

export default function AudioScreen() {
  // const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  // const recorderState = useAudioRecorderState(recorder);
  // const [uri, setUri] = useState<string | null>(null);

  // const player = useAudioPlayer(uri ?? undefined);

  // useEffect(() => {
  //   (async () => {
  //     const { granted } = await requestRecordingPermissionsAsync();
  //     if (!granted) {
  //       Alert.alert("Microphone permission is required to record audio.");
  //       return;
  //     }

  //     await setAudioModeAsync({
  //       allowsRecording: true,
  //       playsInSilentMode: true,
  //     });
  //   })();
  // }, []);

  // const startRecording = async () => {
  //   await recorder.prepareToRecordAsync();
  //   recorder.record();
  // };

  // const stopRecording = async () => {
  //   await recorder.stop();
  //   if (recorder.uri) {
  //     setUri(recorder.uri);
  //     console.log("Audio uri:", recorder.uri)
  //   }
  // };

  return (
    <View style={styles.container}>
      {/* <Button
        title={recorderState.isRecording ? "Stop Recording" : "Start Recording"}
        onPress={recorderState.isRecording ? stopRecording : startRecording}
      />
      {uri && (
        <Button
          title="Play Recording"
          onPress={() => {
            player.seekTo(0);
            player.play();
          }}
        />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
