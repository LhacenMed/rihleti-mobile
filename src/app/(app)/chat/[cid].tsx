// app/chat/[cid].tsx
import { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import SafeContainer from "@/components/SafeContainer";
import { useTheme } from "@/contexts/ThemeContext";
import { getLocales, getCalendars } from "expo-localization";
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

export function Message({
  text,
  time,
  isSent,
  isLast,
  onSwipeAction,
}: {
  text: string;
  time: string;
  isSent: boolean;
  isLast?: boolean;
  onSwipeAction: () => void;
}) {
  const { isDark } = useTheme();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Character threshold to determine layout (adjust as needed)
  const CHAR_THRESHOLD = 30;

  // Maximum swipe distance (in pixels)
  const MAX_SWIPE_DISTANCE = 100;
  // Threshold to trigger action (70% of max distance)
  const ACTION_THRESHOLD = MAX_SWIPE_DISTANCE * 0.7;

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate after 10px horizontal movement
    .failOffsetY([-20, 20]) // Fail if vertical movement exceeds 20px
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
        duration: 300,
      });
      opacity.value = withTiming(1, {
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
    <GestureDetector gesture={panGesture}>
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

        {/* Message content */}
        <Animated.View
          style={[
            animatedStyle,
            // isSent && isLast ? { borderBottomRightRadius: 0 } : !isSent && isLast ? { borderBottomLeftRadius: 0 } : {},
          ]}
          className={`max-w-[75%] flex-1 rounded-2xl p-3 ${
            isSent ? "self-end bg-primary" : "self-start bg-card"
          }`}
        >
          {text.length < CHAR_THRESHOLD ? (
            // Inline layout for short messages
            <Text className={`text-base ${isSent ? "text-white" : "text-foreground"}`}>
              {text}
              <Text className={`text-xs ${isSent ? "text-white/60" : "text-muted-foreground"}`}>
                {"  "}
                {time}{" "}
              </Text>
              {isSent && (
                <Ionicons
                  name="checkmark-done"
                  size={14}
                  color="white"
                  className="ml-1 opacity-80"
                />
              )}
            </Text>
          ) : (
            // Separate layout for long messages
            <>
              <Text className={`text-base ${isSent ? "text-white" : "text-foreground"}`}>
                {text}
              </Text>
              <View className="mt-1 flex-row items-center self-end">
                <Text className={`text-xs ${isSent ? "text-white/60" : "text-muted-foreground"}`}>
                  {time}
                </Text>
                {isSent && (
                  <Ionicons
                    name="checkmark-done"
                    size={14}
                    color="white"
                    className="ml-1 opacity-80"
                  />
                )}
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

// Regular Message component (non-swipeable, for reference)
// const Message = ({ text, time, isSent }: { text: string; time: string; isSent: boolean }) => {
//   const { isDark } = useTheme();
//   return (
//     <View
//       className={`my-1 max-w-[75%] flex-1 rounded-2xl p-3 ${
//         isSent ? "self-end bg-primary" : "self-start bg-card"
//       }`}
//     >
//       <Text className={`text-base ${isSent ? "text-white" : "text-foreground"}`}>{text}</Text>
//       <View className="mt-1 flex-row items-center self-end">
//         <Text className={`text-xs ${isSent ? "text-white/60" : "text-muted-foreground"}`}>
//           {time}
//         </Text>
//         {isSent && (
//           <Ionicons name="checkmark-done" size={14} color="white" className="ml-1 opacity-80" />
//         )}
//       </View>
//     </View>
//   );
// };

export default function ChatScreen() {
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const { isDark } = useTheme();
  const [inputText, setInputText] = useState("");
  const [inputHeight, setInputHeight] = useState(44); // Default height for single line
  // const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // keyboard listeners
  // useEffect(() => {
  //   const showSub = Keyboard.addListener(
  //     Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow",
  //     () => setIsKeyboardVisible(true)
  //   );
  //   const hideSub = Keyboard.addListener(
  //     Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide",
  //     () => setIsKeyboardVisible(false)
  //   );
  //   return () => {
  //     showSub.remove();
  //     hideSub.remove();
  //   };
  // }, []);

  // parse channel id
  useEffect(() => {
    if (!cid) return;
    const [, id] = cid.split(":");
    setChannelId(id);
  }, [cid]);

  // get current user id once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const authUserId = data?.session?.user?.id ?? null;
      if (!cancelled) setCurrentUserId(authUserId);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // keep a ref of currentUserId for realtime callbacks
  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  // load messages & subscribe
  useEffect(() => {
    if (!channelId) return;
    let isMounted = true;

    const load = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, channel_id, sender_auth_id, content, created_at")
        .eq("channel_id", channelId)
        .order("created_at", { ascending: true })
        .limit(500);

      if (!error && isMounted) {
        setMessages(data || []);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 500);
      }
    };
    load();

    const subscription = supabase
      .channel(`public:messages:channel_${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          const newMsg = (payload as any)?.new;
          // Only handle single inserted row events from other users
          if (newMsg && !Array.isArray(newMsg) && newMsg.sender_auth_id !== currentUserIdRef.current) {
            setMessages((p) => {
              // avoid duplicates if already present
              if (p.some((m) => m.id === newMsg.id)) return p;
              return [...p, newMsg];
            });
          }
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 500);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, [channelId]);

  const handleSend = async () => {
    if (!inputText.trim() || !channelId) return;
    const { data } = await supabase.auth.getSession();
    const senderId = data?.session?.user?.id;
    if (!senderId) return;

    // optimistic UI
    const temp = {
      id: `tmp-${Date.now()}`,
      channel_id: channelId,
      sender_auth_id: senderId,
      content: inputText.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages((p) => [...p, temp]);
    setInputText("");
    scrollRef.current?.scrollToEnd({ animated: true });

    const { error } = await supabase.from("messages").insert([
      {
        channel_id: channelId,
        sender_auth_id: senderId,
        content: temp.content,
      },
    ]);

    if (error) {
      console.warn("Failed to send message", error);
      // optionally handle rollback
    }
  };

  // Handle swipe action
  const handleMessageSwipe = (messageText: string) => {
    (global as any).hapticClick();
    console.log("Swiped message:", messageText);
    // You can implement your swipe action here, such as:
    // - Show reply UI
    // - Add to reply queue
    // - Show action menu
    // - etc.
  };

  const keyboard = useAnimatedKeyboard({
    // isStatusBarTranslucentAndroid: true,
    // isNavigationBarTranslucentAndroid: true,
  });
  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.max(0, keyboard.height.value),
  }));

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    // Set minimum height to 44 and maximum to 120 (about 5 lines)
    const newHeight = Math.max(44, Math.min(120, height));
    setInputHeight(newHeight);
  };

  // Format time per device's 12/24h setting without seconds
  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const locale = getLocales()[0]?.languageTag;
    const uses24 = getCalendars()[0]?.uses24hourClock;
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      ...(uses24 === true ? { hour12: false } : uses24 === false ? { hour12: true } : {}),
    };
    return new Intl.DateTimeFormat(locale, options).format(date);
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
          <ScrollView
            ref={scrollRef}
            className="flex-1 bg-muted/30 px-4"
            contentContainerStyle={{ paddingBottom: bottomContainerHeight }}
            // showsVerticalScrollIndicator={false}
          >
            {messages.map((m) => (
              <Message
                key={m.id}
                text={m.content}
                time={formatTime(m.created_at)}
                isSent={m.sender_auth_id === currentUserId}
                onSwipeAction={() => handleMessageSwipe(`${m.content}`)}
              />
            ))}
          </ScrollView>

          <View
            // className={`flex-row items-end border-t border-border bg-card px-3 py-2 ${isKeyboardVisible ? "" : "pb-5"}`}
            className={`flex-row items-end border-t border-border bg-card px-3 py-4`}
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
