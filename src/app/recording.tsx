import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import SafeContainer from "@/components/SafeContainer";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  // withSpring,
  withTiming,
  // runOnJS,
  interpolate,
  // Extrapolate,
  Extrapolation,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

// SwipeableMessage component with gesture handling
const SwipeableMessage = ({
  text,
  time,
  isSent,
  onSwipeAction,
}: {
  text: string;
  time: string;
  isSent: boolean;
  onSwipeAction: () => void;
}) => {
  const { isDark } = useTheme();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Maximum swipe distance (in pixels)
  const MAX_SWIPE_DISTANCE = 100;
  // Threshold to trigger action (70% of max distance)
  const ACTION_THRESHOLD = MAX_SWIPE_DISTANCE * 0.7;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow left swipe (negative translation)
      const newTranslateX = Math.max(Math.min(event.translationX, 0), -MAX_SWIPE_DISTANCE);
      translateX.value = newTranslateX;

      // Update opacity based on swipe distance
      const progress = Math.abs(newTranslateX) / MAX_SWIPE_DISTANCE;
      opacity.value = interpolate(progress, [0, 1], [1, 0.6], Extrapolation.CLAMP);
    })
    .onEnd((event) => {
      const finalTranslateX = Math.max(Math.min(event.translationX, 0), -MAX_SWIPE_DISTANCE);

      // Check if swipe distance exceeds threshold
      if (Math.abs(finalTranslateX) > ACTION_THRESHOLD) {
        // Trigger action
        scheduleOnRN(onSwipeAction);
      }

      // Spring back to original position
      translateX.value = withTiming(0, {
        // damping: 20,
        duration: 300,
      });
      opacity.value = withTiming(1, {
        // damping: 20,
        duration: 300,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const backgroundIndicatorStyle = useAnimatedStyle(() => {
    const progress = Math.abs(translateX.value) / MAX_SWIPE_DISTANCE;
    return {
      opacity: interpolate(progress, [0, 0.5, 1], [0, 0.5, 1], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(progress, [0, 0.5, 1], [0.8, 0.9, 1], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <View className="relative my-1">
      {/* Background indicator that appears during swipe */}
      <Animated.View
        style={backgroundIndicatorStyle}
        className="absolute right-4 top-1/2 z-0 flex-row items-center"
      >
        <View className="rounded-full bg-primary/20 p-2">
          <Ionicons name="arrow-undo-outline" size={16} color={isDark ? "white" : "black"} />
        </View>
        <Text className="ml-2 text-sm text-primary">Reply</Text>
      </Animated.View>

      {/* Message content with gesture detector */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={animatedStyle}
          className={`max-w-[75%] flex-1 rounded-2xl p-3 ${
            isSent ? "self-end bg-primary" : "self-start bg-card"
          }`}
        >
          <Text className={`text-base ${isSent ? "text-white" : "text-foreground"}`}>{text}</Text>
          <View className="mt-1 flex-row items-center self-end">
            <Text className={`text-xs ${isSent ? "text-white/60" : "text-muted-foreground"}`}>
              {time}
            </Text>
            {isSent && (
              <Ionicons name="checkmark-done" size={14} color="white" className="ml-1 opacity-80" />
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

// Regular Message component (non-swipeable, for reference)
const Message = ({ text, time, isSent }: { text: string; time: string; isSent: boolean }) => {
  const { isDark } = useTheme();
  return (
    <View
      className={`my-1 max-w-[75%] flex-1 rounded-2xl p-3 ${
        isSent ? "self-end bg-primary" : "self-start bg-card"
      }`}
    >
      <Text className={`text-base ${isSent ? "text-white" : "text-foreground"}`}>{text}</Text>
      <View className="mt-1 flex-row items-center self-end">
        <Text className={`text-xs ${isSent ? "text-white/60" : "text-muted-foreground"}`}>
          {time}
        </Text>
        {isSent && (
          <Ionicons name="checkmark-done" size={14} color="white" className="ml-1 opacity-80" />
        )}
      </View>
    </View>
  );
};

export default function RecordingScreen() {
  const { isDark } = useTheme();
  const [inputText, setInputText] = useState("");
  const [inputHeight, setInputHeight] = useState(44); // Default height for single line
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Handle swipe action
  const handleMessageSwipe = (messageText: string) => {
    console.log("Swiped message:", messageText);
    // You can implement your swipe action here, such as:
    // - Show reply UI
    // - Add to reply queue
    // - Show action menu
    // - etc.
  };

  // Keyboard listeners
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow",
      () => setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide",
      () => setIsKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const keyboard = useAnimatedKeyboard({
    // isStatusBarTranslucentAndroid: true,
    // isNavigationBarTranslucentAndroid: true,
  });
  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.max(0, keyboard.height.value),
  }));

  const handleSend = () => {
    if (inputText.trim()) {
      // Handle send message logic here
      console.log("Sending message:", inputText);
      setInputText(""); // Clear the input after sending
      setInputHeight(44); // Reset height after sending
    }
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    // Set minimum height to 44 and maximum to 120 (about 5 lines)
    const newHeight = Math.max(44, Math.min(120, height));
    setInputHeight(newHeight);
  };

  const ChatHeader = () => (
    <View className="flex-row items-center">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
        <Text className="text-base font-semibold text-primary-foreground">J</Text>
      </View>
      <View className="ml-3 flex-1 gap-0 self-center">
        <Text className="text-lg font-semibold text-foreground">John Doe</Text>
        <Text className="text-xs text-muted-foreground">last seen 2 hours ago</Text>
      </View>
    </View>
  );

  const RightOptions = () => (
    <View className="flex-row items-center gap-[15px]">
      <TouchableOpacity>
        <Ionicons
          name="call-outline"
          size={22}
          className="text-foreground"
          color={isDark ? "white" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          className="text-foreground"
          color={isDark ? "white" : "black"}
        />
      </TouchableOpacity>
    </View>
  );

  // Calculate dynamic bottom container height based on input height
  const bottomContainerHeight = Math.max(0, inputHeight);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeContainer
        header={{
          titleComponent: <ChatHeader />,
          showBackButton: true,
          rightComponent: <RightOptions />,
        }}
      >
        <Animated.View style={animatedStyle} className="flex-1">
          {/* Messages */}
          <ScrollView
            className="flex-1 bg-muted/30 p-4"
            contentContainerStyle={{ paddingBottom: bottomContainerHeight }}
            showsVerticalScrollIndicator={false}
          >
            <SwipeableMessage
              text="Hey, how are you?"
              time="10:30"
              isSent={false}
              onSwipeAction={() => handleMessageSwipe("Hey, how are you?")}
            />
            <SwipeableMessage
              text="I'm doing great! Thanks for asking."
              time="10:32"
              isSent={true}
              onSwipeAction={() => handleMessageSwipe("I'm doing great! Thanks for asking.")}
            />
            <SwipeableMessage
              text="That's awesome to hear!"
              time="10:33"
              isSent={false}
              onSwipeAction={() => handleMessageSwipe("That's awesome to hear!")}
            />
            <SwipeableMessage
              text="What are you up to today?"
              time="10:35"
              isSent={false}
              onSwipeAction={() => handleMessageSwipe("What are you up to today?")}
            />
            <SwipeableMessage
              text="Just working on some projects. You?"
              time="10:40"
              isSent={true}
              onSwipeAction={() => handleMessageSwipe("Just working on some projects. You?")}
            />
            <SwipeableMessage
              text="Same here, staying busy!"
              time="10:42"
              isSent={false}
              onSwipeAction={() => handleMessageSwipe("Same here, staying busy!")}
            />
            <SwipeableMessage
              text="Let me know if you need any help with those projects!"
              time="10:45"
              isSent={false}
              onSwipeAction={() =>
                handleMessageSwipe("Let me know if you need any help with those projects!")
              }
            />
          </ScrollView>

          {/* Bottom input - now with dynamic height */}
          <View
            className={`flex-row items-end border-t border-border bg-card px-3 py-2 ${isKeyboardVisible ? "" : "pb-5"}`}
            style={{ minHeight: 56 }}
          >
            <TouchableOpacity className="mb-2.5">
              <Ionicons name="happy-outline" size={22} color={isDark ? "white" : "black"} />
            </TouchableOpacity>

            <View
              className="mx-3 flex-1 flex-row items-center rounded-2xl border border-border bg-background px-4"
              style={{ minHeight: inputHeight }}
            >
              <TextInput
                className="flex-1 py-2 text-base text-foreground"
                placeholder="Send a message"
                placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                value={inputText}
                onChangeText={setInputText}
                multiline={true}
                numberOfLines={1}
                maxLength={1000}
                onContentSizeChange={handleContentSizeChange}
                style={{
                  height: inputHeight,
                  textAlignVertical: "center",
                }}
                scrollEnabled={inputHeight >= 120}
              />
            </View>

            <TouchableOpacity
              onPress={inputText.trim() ? handleSend : undefined}
              className="mb-2.5"
            >
              <Ionicons
                name={inputText.trim() ? "send" : "mic"}
                size={22}
                color={isDark ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeContainer>
    </GestureHandlerRootView>
  );
}
