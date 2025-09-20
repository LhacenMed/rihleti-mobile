import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, View, Platform, Text } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import SafeContainer from "@/components/SafeContainer";
import { Channel, MessageInput, MessageList } from "stream-chat-expo";
import { useStreamChat } from "@/contexts/StreamChatContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Loader } from "@/components/ui/loader";

const ChatScreen = () => {
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const router = useRouter();
  const [channel, setChannel] = useState<any>(null);
  const { client, ensureConnected } = useStreamChat();
  const insets = useSafeAreaInsets();
  const headerHeight = 30; // adjust to your header
  const verticalOffset = insets.top + headerHeight;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Request microphone permission
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Microphone permission not granted");
      }
    })();
  }, []);

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

  // Load channel
  useEffect(() => {
    setLoading(true);
    let cancelled = false;
    const run = async () => {
      if (!client || !cid || typeof cid !== "string") return;
      try {
        await ensureConnected();
        const [type, id] = cid.split(":");
        const ch = client.channel(type as any, id);
        await ch.watch();
        if (!cancelled) setChannel(ch);
      } catch (e) {
        console.warn("Failed to load channel", e);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [client, cid]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {channel ? (
        <Channel channel={channel} disableKeyboardCompatibleView={true}>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              // paddingBottom: Platform.OS === "android" ? (isKeyboardVisible ? 24 : 0) : 0,
            }}
            behavior={
              isKeyboardVisible ? (Platform.OS === "ios" ? "padding" : "height") : undefined
            }
            // keyboardVerticalOffset={isKeyboardVisible ? verticalOffset : 0}
          >
            <MessageList />
            <MessageInput audioRecordingEnabled />
          </KeyboardAvoidingView>
        </Channel>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Loader />
        </View>
      )}
    </View>
  );
};

export default ChatScreen;
