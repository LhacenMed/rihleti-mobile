import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import SafeContainer from "@/components/SafeContainer";
import Button from "@/components/ui/button";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { generateFallbackWaveform, SENSITIVITY_PRESETS } from "@/utils/audioUtils";

// A single recorded clip
interface ClipItem {
  id: string;
  uri: string;
  createdAt: number; // epoch ms
  durationMillis?: number;
  fileSizeBytes?: number;
  waveformData?: number[]; // Array of amplitude values for visualization
}

function formatMillis(ms?: number) {
  if (!ms && ms !== 0) return "--:--";
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "-- KB";
  const kb = Math.round(bytes / 1024);
  return `${kb} KB`;
}

// Simple waveform component
function Waveform({
  data,
  isPlaying,
  currentPosition = 0,
  duration = 1,
}: {
  data?: number[];
  isPlaying?: boolean;
  currentPosition?: number;
  duration?: number;
}) {
  // Use provided data or generate fallback waveform
  const waveData = useMemo(() => {
    if (data && data.length > 0) return data;
    return generateFallbackWaveform(duration, 40);
  }, [data, duration]);

  const progressRatio = duration > 0 ? currentPosition / duration : 0;
  const playedBars = Math.floor(waveData.length * progressRatio);

  return (
    <View className="flex-1 flex-row items-center justify-center px-2" style={{ height: 32 }}>
      {waveData.map((amplitude, index) => {
        const isPlayed = isPlaying && index <= playedBars;
        const height = Math.max(2, amplitude * 24);

        return (
          <View
            key={index}
            style={{
              width: 2,
              height,
              marginHorizontal: 0.5,
              borderRadius: 1,
            }}
            className={isPlayed ? "bg-primary" : "bg-muted"}
          />
        );
      })}
    </View>
  );
}

// Enhanced audio clip item component
function AudioClipItem({
  item,
  index,
  totalClips,
  onPlay,
  onSave,
  isPlaying = false,
  playbackPosition = 0,
}: {
  item: ClipItem;
  index: number;
  totalClips: number;
  onPlay: (clip: ClipItem) => void;
  onSave: (clip: ClipItem) => void;
  isPlaying?: boolean;
  playbackPosition?: number;
}) {
  return (
    <View className="flex-row items-center rounded-2xl border border-border bg-card p-3">
      {/* Play button */}
      <Pressable
        onPress={() => onPlay(item)}
        className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${
          isPlaying ? "bg-primary/20" : "bg-primary"
        }`}
      >
        <View className={`${isPlaying ? "bg-primary" : "bg-primary-foreground"}`}>
          {isPlaying ? (
            // Pause icon (two rectangles)
            <View className="flex-row">
              <View className="mr-1 h-3 w-1 bg-current" />
              <View className="h-3 w-1 bg-current" />
            </View>
          ) : (
            // Play icon (triangle)
            <View
              style={{
                width: 0,
                height: 0,
                borderTopWidth: 6,
                borderBottomWidth: 6,
                borderLeftWidth: 8,
                borderTopColor: "transparent",
                borderBottomColor: "transparent",
                borderLeftColor: isPlaying ? "#ffffff" : "currentColor",
                marginLeft: 2,
              }}
            />
          )}
        </View>
      </Pressable>

      {/* Waveform and content */}
      <View className="mr-3 flex-1">
        <Waveform
          data={item.waveformData}
          isPlaying={isPlaying}
          currentPosition={playbackPosition}
          duration={item.durationMillis || 0}
        />

        <View className="mt-1 flex-row items-center justify-between">
          <Text className="text-xs text-muted-foreground">Recording {totalClips - index}</Text>
          <Text className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>

      {/* Duration and file size */}
      <View className="mr-3 items-end">
        <Text className="text-sm font-medium text-foreground">
          {formatMillis(item.durationMillis)}
        </Text>
        <Text className="text-xs text-muted-foreground">{formatFileSize(item.fileSizeBytes)}</Text>
      </View>

      {/* Save button */}
      <Pressable
        onPress={() => onSave(item)}
        className="h-8 w-8 items-center justify-center rounded-full bg-secondary"
      >
        <Text className="text-xs text-secondary-foreground">⬇</Text>
      </Pressable>
    </View>
  );
}

export default function AudioAV() {
  const [clips, setClips] = useState<ClipItem[]>([]);
  const [permissionResponse, requestPermission, getPermission] = Audio.usePermissions();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [playbackPosition, setPlaybackPosition] = useState<number>(0);
  
  // Use the new recording hook with high sensitivity for small voices
  const {
    recording,
    elapsedMs,
    currentWaveformData,
    startRecording: startRecordingHook,
    stopRecording: stopRecordingHook,
    isRecording,
    sensitivityConfig,
    setSensitivityPreset,
    setSensitivityConfig,
  } = useAudioRecording('high'); // Start with high sensitivity

  useEffect(() => {
    return () => {
      // cleanup any playing sound on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  const ensurePermission = useCallback(async () => {
    const cur = permissionResponse ?? (await getPermission());
    if (!cur || cur.status !== "granted") {
      const req = await requestPermission();
      return req.status === "granted";
    }
    return true;
  }, [getPermission, permissionResponse, requestPermission]);

  const startRecording = useCallback(async () => {
    try {
      const granted = await ensurePermission();
      if (!granted) {
        console.warn("Microphone permission not granted");
        return;
      }

      await startRecordingHook();
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }, [ensurePermission, startRecordingHook]);

  const stopRecording = useCallback(async () => {
    try {
      const newClip = await stopRecordingHook();
      if (newClip) {
        setClips((prev) => [newClip, ...prev]);
        console.log("Recording stopped and stored at", newClip.uri);
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  }, [stopRecordingHook]);

  const toggleRecord = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  const playClip = useCallback(
    async (clip: ClipItem) => {
      try {
        // Stop current playback if any
        if (soundRef.current) {
          await soundRef.current.stopAsync().catch(() => {});
          await soundRef.current.unloadAsync().catch(() => {});
          soundRef.current = null;
        }

        // If clicking the same clip that's playing, just stop
        if (currentlyPlaying === clip.id) {
          setCurrentlyPlaying(null);
          setPlaybackPosition(0);
          return;
        }

        const { sound } = await Audio.Sound.createAsync({ uri: clip.uri });
        soundRef.current = sound;
        setCurrentlyPlaying(clip.id);
        setPlaybackPosition(0);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;

          if ("positionMillis" in status) {
            setPlaybackPosition(status.positionMillis || 0);
          }

          if (
            ("didJustFinish" in status && status.didJustFinish) ||
            ("positionMillis" in status && status.positionMillis === status.durationMillis)
          ) {
            // auto-unload on finish
            sound.unloadAsync().catch(() => {});
            if (soundRef.current === sound) {
              soundRef.current = null;
              setCurrentlyPlaying(null);
              setPlaybackPosition(0);
            }
          }
        });

        await sound.playAsync();
      } catch (e) {
        console.error("Failed to play sound", e);
        setCurrentlyPlaying(null);
      }
    },
    [currentlyPlaying]
  );

  const saveClipToDevice = useCallback(async (clip: ClipItem) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant media library permission to save files.", [
          { text: "OK" },
        ]);
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(clip.uri);
      Alert.alert("Success!", `Recording saved to your device's music library.`, [{ text: "OK" }]);
      console.log("Recording saved to media library:", asset.uri);
    } catch (error) {
      console.error("Error saving audio file:", error);
      Alert.alert(
        "Error",
        `Failed to save audio file: ${error instanceof Error ? error.message : String(error)}`,
        [{ text: "OK" }]
      );
    }
  }, []);

  const header = useMemo(() => ({ title: "Audio Recorder (expo-av)", showBackButton: true }), []);

  return (
    <SafeContainer header={header}>
      <View className="flex-1 bg-background p-4">
        {/* Sensitivity Controls */}
        <View className="mb-4 rounded-lg border border-border bg-card p-3">
          <Text className="mb-2 text-sm font-medium text-foreground">Audio Sensitivity</Text>
          <View className="flex-row gap-2">
            {Object.entries(SENSITIVITY_PRESETS).map(([preset, config]) => (
              <Pressable
                key={preset}
                onPress={() => setSensitivityPreset(preset as keyof typeof SENSITIVITY_PRESETS)}
                className={`flex-1 rounded-md px-3 py-2 ${
                  sensitivityConfig.sensitivity === config.sensitivity
                    ? 'bg-primary'
                    : 'bg-secondary'
                }`}
              >
                <Text
                  className={`text-center text-xs font-medium ${
                    sensitivityConfig.sensitivity === config.sensitivity
                      ? 'text-primary-foreground'
                      : 'text-secondary-foreground'
                  }`}
                >
                  {preset === 'veryHigh' ? 'Very High' : preset.charAt(0).toUpperCase() + preset.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="mt-1 text-xs text-muted-foreground">
            Higher sensitivity captures quieter sounds and whispers
          </Text>
        </View>

        {/* Record Controls */}
        <View className="items-center gap-4 pb-4">
          <Pressable
            onPress={toggleRecord}
            className={`h-20 w-20 items-center justify-center rounded-full ${
              isRecording ? "bg-destructive" : "bg-primary"
            }`}
          >
            <Text className="text-center text-sm font-semibold text-primary-foreground">
              {isRecording ? "Stop" : "Rec"}
            </Text>
          </Pressable>

          <Text className="text-sm text-muted-foreground">
            {isRecording ? `Recording… ${formatMillis(elapsedMs)}` : "Tap to start recording"}
          </Text>

          {/* Real-time waveform during recording */}
          {isRecording && currentWaveformData.length > 0 && (
            <View className="w-full px-4">
              <Text className="text-xs text-muted-foreground text-center mb-2">Live Waveform</Text>
              <View className="bg-card border border-border rounded-lg p-2">
                <Waveform
                  data={currentWaveformData}
                  isPlaying={false}
                  currentPosition={0}
                  duration={elapsedMs}
                />
              </View>
            </View>
          )}

          <View className="w-full">
            <Button
              variant="outline"
              onPress={toggleRecord}
              className="w-full"
              textClassName="text-foreground"
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
          </View>
        </View>

        {/* Recorded Clips List */}
        <View className="mt-2 flex-1">
          <Text className="mb-2 text-lg font-semibold text-foreground">Recorded clips</Text>
          {clips.length === 0 ? (
            <View className="items-center justify-center rounded-md border border-dashed border-border p-6">
              <Text className="text-sm text-muted-foreground">No recordings yet</Text>
            </View>
          ) : (
            <FlatList
              data={clips}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
              renderItem={({ item, index }) => (
                <AudioClipItem
                  item={item}
                  index={index}
                  totalClips={clips.length}
                  onPlay={playClip}
                  onSave={saveClipToDevice}
                  isPlaying={currentlyPlaying === item.id}
                  playbackPosition={playbackPosition}
                />
              )}
            />
          )}
        </View>
      </View>
    </SafeContainer>
  );
}
