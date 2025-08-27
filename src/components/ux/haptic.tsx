import { useEffect } from "react";
import * as Haptic from "expo-haptics";

// Types for haptic feedback
export type HapticFeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error"
  | "rigid"
  | "soft";

interface HapticFeedbackProps {
  /**
   * Type of haptic feedback to trigger
   */
  type: HapticFeedbackType;

  /**
   * Whether to trigger the haptic feedback immediately when component mounts
   * @default true
   */
  triggerOnMount?: boolean;

  /**
   * Delay in milliseconds before triggering the haptic feedback
   * @default 0
   */
  delay?: number;

  /**
   * Whether haptic feedback is enabled (useful for user preferences)
   * @default true
   */
  enabled?: boolean;
}

/**
 * Maps haptic feedback types to Expo Haptics methods
 */
const getHapticMethod = (type: HapticFeedbackType) => {
  switch (type) {
    case "light":
      return () => Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
    case "medium":
      return () => Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
    case "heavy":
      return () => Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Heavy);
    case "rigid":
      return () => Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Rigid);
    case "soft":
      return () => Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Soft);
    case "selection":
      return () => Haptic.selectionAsync();
    case "success":
      return () => Haptic.notificationAsync(Haptic.NotificationFeedbackType.Success);
    case "warning":
      return () => Haptic.notificationAsync(Haptic.NotificationFeedbackType.Warning);
    case "error":
      return () => Haptic.notificationAsync(Haptic.NotificationFeedbackType.Error);
    default:
      return () => Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
  }
};

/**
 * Triggers haptic feedback
 */
export const triggerHaptic = async (
  type: HapticFeedbackType,
  enabled: boolean = true
): Promise<void> => {
  if (!enabled) return;

  try {
    const hapticMethod = getHapticMethod(type);
    await hapticMethod();
  } catch (error) {
    console.warn("Haptic feedback failed:", error);
  }
};

/**
 * Component that triggers haptic feedback based on props
 * This component doesn't render anything visible
 */
const HapticFeedback = ({
  type,
  triggerOnMount = true,
  delay = 0,
  enabled = true,
}: HapticFeedbackProps) => {
  useEffect(() => {
    if (!triggerOnMount || !enabled) return;

    const timeoutId = setTimeout(() => {
      triggerHaptic(type, enabled);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [type, triggerOnMount, delay, enabled]);

  // This component doesn't render anything
  return null;
};

export default HapticFeedback;
