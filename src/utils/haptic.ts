// import * as Haptic from "expo-haptics";
import { trigger } from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// Universal haptic function accessible globally
const hapticClick = () => {
  // Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
  trigger("effectClick", options);
};

const hapticHeavyClick = () => {
  // Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
  trigger("effectHeavyClick", options);
};

const hapticTick = () => {
  // Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
  trigger("effectTick", options);
};

// Make it globally accessible
(global as any).hapticClick = hapticClick;
(global as any).hapticHeavyClick = hapticHeavyClick;
(global as any).hapticTick = hapticTick;

export { hapticClick, hapticHeavyClick, hapticTick };
