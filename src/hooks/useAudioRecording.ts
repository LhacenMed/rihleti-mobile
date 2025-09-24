import { useCallback, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { 
  dbToAmplitude, 
  smoothAmplitudes, 
  downsampleAmplitudes, 
  generateFallbackWaveform,
  AudioSensitivityConfig,
  SENSITIVITY_PRESETS
} from '@/utils/audioUtils';

interface ClipItem {
  id: string;
  uri: string;
  createdAt: number;
  durationMillis?: number;
  fileSizeBytes?: number;
  waveformData?: number[];
}

interface UseAudioRecordingReturn {
  recording: Audio.Recording | null;
  elapsedMs: number;
  currentWaveformData: number[];
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<ClipItem | null>;
  isRecording: boolean;
  sensitivityConfig: AudioSensitivityConfig;
  setSensitivityPreset: (preset: keyof typeof SENSITIVITY_PRESETS) => void;
  setSensitivityConfig: (config: Partial<AudioSensitivityConfig>) => void;
}

export function useAudioRecording(
  initialPreset: keyof typeof SENSITIVITY_PRESETS = 'high'
): UseAudioRecordingReturn {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [currentWaveformData, setCurrentWaveformData] = useState<number[]>([]);
  const [sensitivityConfig, setSensitivityConfigState] = useState<AudioSensitivityConfig>(
    SENSITIVITY_PRESETS[initialPreset]
  );
  const rawAmplitudesRef = useRef<number[]>([]);

  const onRecordingStatusUpdate = useCallback((status: Audio.RecordingStatus) => {
    if (!status.isRecording) return;

    setElapsedMs(status.durationMillis ?? 0);

    // Capture metering data for real-time waveform
    if (status.metering !== undefined) {
      const amplitude = dbToAmplitude(
        status.metering,
        sensitivityConfig.sensitivity,
        sensitivityConfig.noiseFloor
      );
      rawAmplitudesRef.current.push(amplitude);

      // Update visual waveform with smoothed and downsampled data
      const smoothed = smoothAmplitudes(
        rawAmplitudesRef.current,
        sensitivityConfig.smoothingFactor,
        sensitivityConfig.preservePeaks
      );
      const downsampled = downsampleAmplitudes(smoothed, 40);
      setCurrentWaveformData(downsampled);
    }
  }, [sensitivityConfig]);

  const startRecording = useCallback(async () => {
    try {
      // Reset waveform data
      rawAmplitudesRef.current = [];
      setCurrentWaveformData([]);
      setElapsedMs(0);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1, // DoNotMix
        interruptionModeAndroid: 1, // DoNotMix
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      const { recording: rec } = await Audio.Recording.createAsync(
        {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          isMeteringEnabled: true,
        },
        onRecordingStatusUpdate,
        50 // Faster updates for smoother waveform (50ms intervals)
      );

      setRecording(rec);
    } catch (err) {
      console.error('Failed to start recording', err);
      throw err;
    }
  }, [onRecordingStatusUpdate]);

  const stopRecording = useCallback(async (): Promise<ClipItem | null> => {
    if (!recording) return null;

    try {
      await recording.stopAndUnloadAsync();
    } catch (e) {
      console.warn('stopAndUnloadAsync error (possibly too short):', e);
    }

    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } catch {}

    const uri = recording.getURI();
    const status = await recording.getStatusAsync();

    setRecording(null);

    if (!uri) return null;

    // Process final waveform data
    let finalWaveformData: number[];
    
    if (rawAmplitudesRef.current.length > 0) {
      // Use real metering data
      const smoothed = smoothAmplitudes(
        rawAmplitudesRef.current,
        sensitivityConfig.smoothingFactor,
        sensitivityConfig.preservePeaks
      );
      finalWaveformData = downsampleAmplitudes(smoothed, 40);
    } else {
      // Fallback to generated waveform
      finalWaveformData = generateFallbackWaveform(status.durationMillis, 40);
    }

    // Get file size
    let fileSizeBytes: number | undefined;
    try {
      const { getInfoAsync } = await import('expo-file-system/legacy');
      const fileInfo = await getInfoAsync(uri);
      fileSizeBytes = fileInfo.exists ? fileInfo.size : undefined;
    } catch (error) {
      console.warn('Could not get file size:', error);
    }

    const newClip: ClipItem = {
      id: `${Date.now()}`,
      uri,
      createdAt: Date.now(),
      durationMillis: status.durationMillis,
      fileSizeBytes,
      waveformData: finalWaveformData,
    };

    // Reset current waveform data
    setCurrentWaveformData([]);
    rawAmplitudesRef.current = [];

    return newClip;
  }, [recording, sensitivityConfig]);

  const setSensitivityPreset = useCallback((preset: keyof typeof SENSITIVITY_PRESETS) => {
    setSensitivityConfigState(SENSITIVITY_PRESETS[preset]);
  }, []);

  const setSensitivityConfig = useCallback((config: Partial<AudioSensitivityConfig>) => {
    setSensitivityConfigState(prev => ({ ...prev, ...config }));
  }, []);

  return {
    recording,
    elapsedMs,
    currentWaveformData,
    startRecording,
    stopRecording,
    isRecording: !!recording,
    sensitivityConfig,
    setSensitivityPreset,
    setSensitivityConfig,
  };
}
