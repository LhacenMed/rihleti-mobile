import { AudioBuffer as RNAudioBuffer } from 'react-native-audio-api';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Convert AudioBuffer to base64 encoded PCM data
 * Note: Real opus encoding would require native module
 */
export const encodeAudioBuffer = (buffer: RNAudioBuffer): string => {
  const channelData = buffer.getChannelData(0);
  const pcmData = new Float32Array(channelData);
  
  // Convert Float32Array to base64
  const bytes = new Uint8Array(pcmData.buffer);
  let binary = '';
  const chunkSize = 0x8000; // 32KB chunks
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

/**
 * Save audio buffer to opus file (currently saves as PCM base64)
 */
export const saveAudioToOpus = async (
  buffer: RNAudioBuffer,
  fileName: string,
  directory: string
): Promise<string> => {
  const base64 = encodeAudioBuffer(buffer);
  const uri = `${directory}${fileName}`;
  
  await FileSystem.writeAsStringAsync(uri, base64, {
    encoding: FileSystem.EncodingType.Base64
  });
  
  return uri;
};

/**
 * Create cache directory for recordings
 */
export const ensureRecordingsCacheDir = async (): Promise<string> => {
  const cacheDir = `${FileSystem.cacheDirectory}recordings/`;
  const dirInfo = await FileSystem.getInfoAsync(cacheDir);
  
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
  }
  
  return cacheDir;
};

/**
 * Format duration in mm:ss format
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};