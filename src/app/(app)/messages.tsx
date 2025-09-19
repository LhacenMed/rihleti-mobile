import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SafeContainer from "@/components/SafeContainer";
import { ChannelList } from "stream-chat-expo";
import { useAuth } from "@/contexts/AuthContext";
import { useStreamChat } from "@/contexts/StreamChatContext";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const Messages = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { ensureConnected } = useStreamChat();
  const { isDark } = useTheme();

  useEffect(() => {
    ensureConnected();
  }, [ensureConnected]);

  const filters = useMemo(() => {
    if (!user?.id) return { type: "messaging" } as any;
    return { type: "messaging", members: { $in: [user.id] } } as any;
  }, [user?.id]);

  const sort = useMemo(() => ({ last_message_at: -1 as const }), []);
  const options = useMemo(() => ({ state: true, watch: true, presence: true }), []);

  return (
    <SafeContainer
      header={{
        title: "Messages",
        showBackButton: true,
        rightComponent: (
          <TouchableOpacity onPress={() => router.push("/(app)/new-chat")}>
            <Ionicons name="add-circle-outline" size={22} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
        ),
      }}
    >
      <View style={{ flex: 1 }}>
        <ChannelList
          filters={filters}
          sort={sort}
          options={options}
          onSelect={(channel) => {
            const cid = (channel as any).cid as string;
            router.push({ pathname: "/(app)/chat/[cid]", params: { cid } });
          }}
        />
      </View>
    </SafeContainer>
  );
};

export default Messages;
