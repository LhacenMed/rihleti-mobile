import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { ModalContentProps, showModal } from "@whitespectre/rn-modal-presenter";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  ReduceMotion,
} from "react-native-reanimated";
import * as Haptic from "expo-haptics";

type SearchModalProps = {
  departure: string;
  destination: string;
};

const SearchModal = ({ dismiss, departure, destination }: SearchModalProps & ModalContentProps) => {
  const { isDark } = useTheme();
  const height = useSharedValue(80);
  const width = useSharedValue(420);
  const translateY = useSharedValue(47);
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(1);

  const springConfig = {
    stiffness: 1610,
    damping: 120,
    mass: 4,
    // velocity: -1500,
    overshootClamping: false,
    reduceMotion: ReduceMotion.System,
  };

  const springOutConfig = {
    stiffness: 1800,
    damping: 450,
    mass: 4,
    overshootClamping: false,
    reduceMotion: ReduceMotion.System,
  };

  const animateSize = (h: number, w: number) => {
    height.value = withSpring(h, springConfig);
    width.value = withSpring(w, springConfig);
  };
  const animateOutSize = (h: number, w: number) => {
    height.value = withSpring(h, springOutConfig);
    width.value = withSpring(w, springOutConfig);
  };

  useEffect(() => {
    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
    // Expand to full size
    animateSize(400, 380);
    scale.value = withSpring(1, springConfig);
    translateY.value = withSpring(47, springConfig);
  }, []);

  const animateOut = () => {
    scale.value = withSpring(0.7, springOutConfig);
    translateY.value = withSpring(47, springOutConfig);
    animateOutSize(80, 420);

    // Start fade-out near the end of the animation
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 50 });
    }, 80);

    // Dismiss modal after fade completes
    setTimeout(() => {
      dismiss();
    }, 100);
  };

  const modalStyle = useAnimatedStyle(() => ({
    height: height.value,
    width: width.value,
    opacity: opacity.value,
    // Scale from top
    transformOrigin: "top center",
    transform: [{ translateY: translateY.value }, { scaleY: scale.value }, { scaleX: scale.value }],
  }));

  return (
    <View className="absolute inset-0 items-center justify-center">
      <TouchableWithoutFeedback onPress={animateOut}>
        <View className="absolute inset-0" />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[modalStyle, { padding: 10 }]}
        className="absolute top-0 -translate-y-5 overflow-hidden rounded-2xl border border-muted-foreground bg-secondary p-6"
      >
        {/* Header */}
        <View className="relative mb-6 flex-row items-center justify-center">
          <TouchableOpacity onPress={animateOut} className="absolute left-0">
            <Ionicons name="close" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">Edit your search</Text>
        </View>

        {/* Trip Type Tabs */}
        <View className="mb-6 flex-row">
          <TouchableOpacity className="mr-6">
            <Text className="text-base font-medium text-foreground">Round-trip</Text>
          </TouchableOpacity>
          <TouchableOpacity className="mr-6">
            <Text className="text-base text-muted-foreground">One-way</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-base text-muted-foreground">Multi-city</Text>
          </TouchableOpacity>
        </View>

        {/* Location Fields */}
        <View className="mb-4">
          <TouchableOpacity className="mb-3 rounded-lg border border-border bg-background p-4">
            <Text className="text-base font-medium text-foreground">{departure}</Text>
            <Text className="text-sm text-muted-foreground">NKC • Mauritania</Text>
          </TouchableOpacity>

          {/* Swap Button */}
          <View className="absolute right-4 top-8 z-10">
            <TouchableOpacity className="rounded-full bg-card p-2">
              <Ionicons name="swap-vertical" size={20} color={isDark ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="rounded-lg border border-border bg-background p-4">
            <Text className="text-base font-medium text-foreground">{destination}</Text>
            <Text className="text-sm text-muted-foreground">DXB • United Arab Emirates</Text>
          </TouchableOpacity>
        </View>

        {/* Date Fields */}
        <TouchableOpacity className="mb-4 rounded-lg border border-border bg-background p-4">
          <Text className="text-base font-medium text-foreground">29 Sep Mon → 6 Oct Mon</Text>
        </TouchableOpacity>

        {/* Traveler & Class */}
        <TouchableOpacity className="mb-6 rounded-lg border border-border bg-background p-4">
          <Text className="text-base font-medium text-foreground">1 traveler, Economy</Text>
        </TouchableOpacity>

        {/* Search Button */}
        <TouchableOpacity
          className="rounded-[10px] bg-primary py-4"
          onPress={() => {
            // TODO: Implement search functionality
            animateOut();
          }}
        >
          <Text className="text-center text-base font-semibold text-primary-foreground">
            Search
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// Helper function to show the search modal
export const showSearchModal = (departure: string, destination: string) => {
  return showModal(SearchModal, { departure, destination });
};

export default SearchModal;
