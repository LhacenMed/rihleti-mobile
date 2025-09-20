// app/chat/index.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import SafeContainer from "@/components/SafeContainer";
import { Ionicons } from "@expo/vector-icons";
import { fetchMyChannels, type ChannelRow } from "@/utils/chat-helpers";
import { router } from "expo-router";

export default function ChannelsListScreen() {
  const [channels, setChannels] = useState<ChannelRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const rows = await fetchMyChannels();
      setChannels(rows);
    };
    load();
  }, []);

  return (
    <SafeContainer
      header={{
        title: "Conversations",
        rightComponent: (
          <TouchableOpacity
            onPress={() => {
              router.push("/(app)/chat/new");
            }}
          >
            <Ionicons name="add" color="white" size={22} />
          </TouchableOpacity>
        ),
      }}
    >
      <ScrollView className="p-4">
        {channels.map((ch) => (
          <TouchableOpacity
            key={ch.id}
            className="mb-3 rounded-lg border border-border bg-card p-4"
            onPress={() =>
              router.push({ pathname: "/(app)/chat/[cid]", params: { cid: `messaging:${ch.id}` } })
            }
          >
            <Text className="text-foreground font-semibold">
              {ch.title ?? ch.agency_name ?? ch.client_name ?? "Chat"}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {new Date(ch.created_at).toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeContainer>
  );
}
