/**
 * Converts decibel metering value to normalized amplitude (0-1)
 * @param meteringDb Metering value in decibels from expo-av
 * @param sensitivity Sensitivity multiplier (1-10, higher = more sensitive)
 * @param noiseFloor Minimum dB level to consider as silence (default: -60dB)
 * @returns Normalized amplitude between 0.05 and 1.0
 */
export function dbToAmplitude(
  meteringDb: number, 
  sensitivity: number = 3.5, 
  noiseFloor: number = -60
): number {
  // Clamp meteringDb to reasonable range (-80dB to 0dB)
  const clampedDb = Math.max(-80, Math.min(0, meteringDb));
  
  // Apply noise floor - anything below this is considered silence
  if (clampedDb <= noiseFloor) {
    return 0.05; // Very low baseline for silence
  }
  
  // Normalize dB range: -60dB to 0dB becomes 0 to 1
  const normalizedDb = (clampedDb - noiseFloor) / (0 - noiseFloor);
  
  // Apply sensitivity curve - makes quiet sounds more visible
  const sensitivityCurve = Math.pow(normalizedDb, 1 / sensitivity);
  
  // Scale to final range with minimum baseline
  const finalAmplitude = sensitivityCurve * 0.95 + 0.05;
  
  return Math.max(0.05, Math.min(1, finalAmplitude));
}

/**
 * Smooths amplitude data to reduce visual noise while preserving peaks
 * @param amplitudes Array of raw amplitude values
 * @param smoothingFactor Smoothing factor (0-1, higher = more smoothing)
 * @param preservePeaks Whether to preserve sudden amplitude peaks
 * @returns Smoothed amplitude array
 */
export function smoothAmplitudes(
  amplitudes: number[], 
  smoothingFactor: number = 0.2, 
  preservePeaks: boolean = true
): number[] {
  if (amplitudes.length === 0) return [];
  
  const smoothed = [amplitudes[0]];
  
  for (let i = 1; i < amplitudes.length; i++) {
    const current = amplitudes[i];
    const previous = smoothed[i - 1];
    
    // If preservePeaks is enabled, reduce smoothing for sudden increases
    let adaptiveSmoothingFactor = smoothingFactor;
    if (preservePeaks && current > previous * 1.5) {
      // Reduce smoothing when there's a sudden amplitude increase
      adaptiveSmoothingFactor = smoothingFactor * 0.3;
    }
    
    const smoothedValue = previous * adaptiveSmoothingFactor + current * (1 - adaptiveSmoothingFactor);
    smoothed.push(smoothedValue);
  }
  
  return smoothed;
}

/**
 * Downsamples amplitude data for visualization
 * @param amplitudes Full amplitude array
 * @param targetLength Desired length for visualization
 * @returns Downsampled amplitude array
 */
export function downsampleAmplitudes(amplitudes: number[], targetLength: number = 40): number[] {
  if (amplitudes.length === 0) return [];
  if (amplitudes.length <= targetLength) return [...amplitudes];
  
  const step = amplitudes.length / targetLength;
  const downsampled: number[] = [];
  
  for (let i = 0; i < targetLength; i++) {
    const start = Math.floor(i * step);
    const end = Math.floor((i + 1) * step);
    
    // Take the maximum value in each segment for better visual representation
    let maxValue = 0;
    for (let j = start; j < end; j++) {
      maxValue = Math.max(maxValue, amplitudes[j] || 0);
    }
    
    downsampled.push(maxValue);
  }
  
  return downsampled;
}

/**
 * Audio sensitivity configuration
 */
export interface AudioSensitivityConfig {
  /** Sensitivity multiplier (1-10, higher = more sensitive to quiet sounds) */
  sensitivity: number;
  /** Noise floor in dB (sounds below this are considered silence) */
  noiseFloor: number;
  /** Smoothing factor for amplitude data (0-1, higher = more smoothing) */
  smoothingFactor: number;
  /** Whether to preserve sudden amplitude peaks */
  preservePeaks: boolean;
}

/**
 * Default sensitivity configurations
 */
export const SENSITIVITY_PRESETS: Record<string, AudioSensitivityConfig> = {
  low: {
    sensitivity: 2.0,
    noiseFloor: -50,
    smoothingFactor: 0.4,
    preservePeaks: false,
  },
  medium: {
    sensitivity: 3.5,
    noiseFloor: -60,
    smoothingFactor: 0.2,
    preservePeaks: true,
  },
  high: {
    sensitivity: 5.5,
    noiseFloor: -70,
    smoothingFactor: 0.1,
    preservePeaks: true,
  },
  veryHigh: {
    sensitivity: 8.0,
    noiseFloor: -75,
    smoothingFactor: 0.05,
    preservePeaks: true,
  },
};

/**
 * Generates realistic fallback waveform when no real data is available
 * @param duration Duration in milliseconds
 * @param length Desired waveform length
 * @returns Generated amplitude array
 */
export function generateFallbackWaveform(duration: number = 5000, length: number = 40): number[] {
  return Array.from({ length }, (_, i) => {
    const position = i / length;
    
    // Create envelope (fade in/out)
    const envelope = Math.sin(position * Math.PI) * 0.8;
    
    // Add some variation
    const variation = 0.6 + Math.random() * 0.4;
    
    // Combine envelope and variation
    return Math.max(0.05, Math.min(1, envelope * variation));
  });
}
