import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import {
  AudioContext,
  AudioRecorder,
  AudioBufferSourceNode,
  AudioBuffer as RNAudioBuffer,
} from "react-native-audio-api";
import * as FileSystem from "expo-file-system/legacy";
import SafeContainer from "@/components/SafeContainer";
import Button from "@/components/ui/button";
import { formatDuration } from "@/utils/audio-helpers";

// Constants
const SAMPLE_RATE = 16000;
const CACHE_DIR = `${FileSystem.cacheDirectory}recordings/`;
const AUDIO_FORMAT = "wav";

// Types
interface Recording {
  id: string;
  name: string;
  duration: number;
  timestamp: Date;
  uri: string;
  buffer?: RNAudioBuffer;
  fileSize?: number;
  extension?: string;
}

// Helper functions
const ensureCacheDir = async () => {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
  return CACHE_DIR;
};

const generateRecordingId = () => {
  const timestamp = Date.now();
  const id = Math.random().toString(36).substr(2, 9);
  return { timestamp, id, fileName: `${timestamp}_${id}.${AUDIO_FORMAT}` };
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

// Helper to create WAV file from AudioBuffer
const createWavFromBuffer = (buffer: RNAudioBuffer): ArrayBuffer => {
  const channelData = buffer.getChannelData(0);
  const length = channelData.length;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  
  // Helper to write string to DataView
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };
  
  // WAV header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true); // file size - 8
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // audio format (1 = PCM)
  view.setUint16(22, 1, true); // num channels
  view.setUint32(24, SAMPLE_RATE, true); // sample rate
  view.setUint32(28, SAMPLE_RATE * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, 'data');
  view.setUint32(40, length * 2, true); // data chunk size
  
  // Convert float samples to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }
  
  return arrayBuffer;
};

const saveBufferToFile = async (buffer: RNAudioBuffer, fileName: string) => {
  await ensureCacheDir();
  const uri = `${CACHE_DIR}${fileName}`;
  
  // Create WAV file
  const wavArrayBuffer = createWavFromBuffer(buffer);
  const wavBytes = new Uint8Array(wavArrayBuffer);
  
  // Convert to base64 in chunks
  let binary = '';
  const chunkSize = 0x8000; // 32KB chunks
  for (let i = 0; i < wavBytes.length; i += chunkSize) {
    const chunk = wavBytes.subarray(i, Math.min(i + chunkSize, wavBytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  const base64 = btoa(binary);
  
  await FileSystem.writeAsStringAsync(uri, base64, {
    encoding: FileSystem.EncodingType.Base64
  });
  
  return uri;
};

const loadBufferFromFile = async (uri: string, audioContext: AudioContext) => {
  // Read the WAV file as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64
  });
  
  // Convert base64 to ArrayBuffer
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Decode the WAV file using the audio context
  return audioContext.decodeAudioData(bytes.buffer);
};

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const recordedBuffersRef = useRef<RNAudioBuffer[]>([]);

  useEffect(() => {
    audioContextRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });
    loadCachedRecordings();

    return () => {
      try {
        recorderRef.current?.stop();
        recorderRef.current?.disconnect();
      } catch (e) {
        // Ignore cleanup errors
      }
      try {
        sourceNodeRef.current?.stop();
      } catch (e) {
        // Ignore cleanup errors
      }
      try {
        audioContextRef.current?.close();
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  const loadCachedRecordings = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
      if (!dirInfo.exists) return;
      
      const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
      const recordings = await Promise.all(
        files
          .filter(f => f.endsWith(`.${AUDIO_FORMAT}`))
          .map(async file => {
            const [timestamp, id] = file.replace(`.${AUDIO_FORMAT}`, '').split('_');
            const fileUri = `${CACHE_DIR}${file}`;
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            
            return {
              id: id || Date.now().toString(),
              name: `Recording ${new Date(parseInt(timestamp)).toLocaleString()}`,
              duration: 0,
              timestamp: new Date(parseInt(timestamp)),
              uri: fileUri,
              fileSize: fileInfo.size || 0,
              extension: AUDIO_FORMAT.toUpperCase()
            };
          })
      );
      
      setRecordings(recordings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (error) {
      console.error('Error loading recordings:', error);
    }
  };

  const startRecording = useCallback(async () => {
    if (!audioContextRef.current) return;

    try {
      recordedBuffersRef.current = [];

      recorderRef.current = new AudioRecorder({
        sampleRate: SAMPLE_RATE,
        bufferLengthInSamples: SAMPLE_RATE, // 1 second buffer
      });

      const adapter = audioContextRef.current.createRecorderAdapter();
      recorderRef.current.connect(adapter);
      recorderRef.current.onAudioReady((e) => recordedBuffersRef.current.push(e.buffer));
      recorderRef.current.start();

      setRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Failed to start recording");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recorderRef.current || !audioContextRef.current) return;

    setRecording(false); // Stop recording state immediately

    try {
      recorderRef.current.stop();
      recorderRef.current.disconnect();
      recorderRef.current = null; // Clear ref after stopping

      const buffers = recordedBuffersRef.current;
      if (!buffers || buffers.length === 0) {
        recordedBuffersRef.current = [];
        return;
      }

      const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
      if (totalLength === 0) {
        recordedBuffersRef.current = [];
        return;
      }

      // Combine buffers
      const combined = audioContextRef.current.createBuffer(1, totalLength, SAMPLE_RATE);
      const channelData = combined.getChannelData(0);
      let offset = 0;

      buffers.forEach((buffer) => {
        const data = buffer.getChannelData(0);
        channelData.set(data, offset);
        offset += data.length;
      });

      // Clear buffers after combining
      recordedBuffersRef.current = [];

      // Save recording
      const { timestamp, id, fileName } = generateRecordingId();
      const uri = await saveBufferToFile(combined, fileName);
      
      // Get file size
      const fileInfo = await FileSystem.getInfoAsync(uri);
      
      setRecordings(prev => [{
        id,
        name: `Recording ${new Date(timestamp).toLocaleString()}`,
        duration: combined.duration,
        timestamp: new Date(timestamp),
        uri,
        buffer: combined,
        fileSize: fileInfo.size || 0,
        extension: AUDIO_FORMAT.toUpperCase()
      }, ...prev]);
    } catch (error) {
      console.error("Failed to save recording:", error);
      // Only show alert if it's a user-facing error
      if (error instanceof Error && !error.message.includes("buttons.slice")) {
        Alert.alert("Error", "Failed to save recording");
      }
    }
  }, []);

  const playRecording = useCallback(async (recording: Recording) => {
    if (!audioContextRef.current) return;

    try {
      stopPlayback();

      // Load buffer if not cached
      let buffer = recording.buffer;
      if (!buffer) {
        buffer = await loadBufferFromFile(recording.uri, audioContextRef.current);
        setRecordings((prev) => prev.map((r) => (r.id === recording.id ? { ...r, buffer } : r)));
      }

      // Play audio
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onEnded = () => {
        setPlaying(null);
        sourceNodeRef.current = null;
      };
      source.start(0);

      sourceNodeRef.current = source;
      setPlaying(recording.id);
    } catch (error) {
      console.error("Failed to play recording:", error);
      Alert.alert("Error", "Failed to play recording");
    }
  }, []);

  const stopPlayback = useCallback(() => {
    sourceNodeRef.current?.stop();
    sourceNodeRef.current = null;
    setPlaying(null);
  }, []);

  const deleteRecording = useCallback(
    async (id: string) => {
      const recording = recordings.find((r) => r.id === id);
      if (!recording) return;

      try {
        await FileSystem.deleteAsync(recording.uri, { idempotent: true });
        setRecordings((prev) => prev.filter((r) => r.id !== id));
      } catch (error) {
        console.error("Failed to delete recording:", error);
        Alert.alert("Error", "Failed to delete recording");
      }
    },
    [recordings]
  );

  const RecordButton = () => (
    <Pressable
      onPress={() => (recording ? stopRecording() : startRecording())}
      className={`h-20 w-20 items-center justify-center rounded-full ${
        recording ? "bg-destructive" : "bg-primary"
      }`}
    >
      <Text className="text-center text-sm font-semibold text-primary-foreground">
        {recording ? "Stop" : "Rec"}
      </Text>
    </Pressable>
  );

  const RecordingItem = ({ rec }: { rec: Recording }) => (
    <View className="mb-2 flex-row items-center justify-between rounded-md border border-border p-3">
      <View className="flex-1">
        <Text className="text-sm font-medium text-foreground">{rec.name}</Text>
        <View className="flex-row items-center gap-3">
          <Text className="text-xs text-muted-foreground">
            {formatDuration(rec.duration)}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {rec.extension || 'WAV'}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {formatFileSize(rec.fileSize || 0)}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          onPress={() => playing === rec.id ? stopPlayback() : playRecording(rec)}
        >
          {playing === rec.id ? "Stop" : "Play"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onPress={() => {
            Alert.alert('Delete Recording', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', onPress: () => deleteRecording(rec.id), style: 'destructive' }
            ]);
          }}
        >
          Delete
        </Button>
      </View>
    </View>
  );

  return (
    <SafeContainer header={{ title: "Voice Recorder (RNAudioAPI)", showBackButton: true }}>
      <View className="flex-1 bg-background p-4">
        <View className="items-center gap-4 pb-4">
          <RecordButton />
          <Text className="text-sm text-muted-foreground">
            {recording ? "Recording..." : "Tap to start recording"}
          </Text>
        </View>

        <View className="mt-2 flex-1">
          <Text className="mb-2 text-lg font-semibold text-foreground">
            Recorded clips ({recordings.length})
          </Text>
          {recordings.length === 0 ? (
            <View className="items-center justify-center rounded-md border border-dashed border-border p-6">
              <Text className="text-sm text-muted-foreground">No recordings yet</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {recordings.map((rec) => (
                <RecordingItem key={rec.id} rec={rec} />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeContainer>
  );
}
