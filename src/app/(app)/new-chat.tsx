import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import SafeContainer from "@/components/SafeContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useStreamChat } from "@/contexts/StreamChatContext";

interface StreamUserItem {
  id: string;
  name?: string | null;
  image?: string | null;
}

const NewChat = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<StreamUserItem[]>([]);

  const { client, ensureConnected } = useStreamChat();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!client || !user?.id) return;
      try {
        setLoading(true);
        await ensureConnected();
        const res = await client.queryUsers({}, { last_active: -1 }, { limit: 50 });
        const otherUsers = (res.users as any[]).filter((u) => u.id !== user.id);
        if (!cancelled) setUsers(otherUsers as any);
      } catch (e) {
        // console.warn("Failed to load users", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [client, user?.id]);

  const startChat = async (peerId: string) => {
    if (!client || !user?.id) return;
    try {
      await ensureConnected();
      const channel = client.channel("messaging", { members: [user.id, peerId] });
      // Create or reuse distinct channel
      await channel.create();
      // Ensure state is loaded
      await channel.watch();
      router.replace({ pathname: "/(app)/chat/[cid]", params: { cid: channel.cid } });
    } catch (e) {
      // console.warn("Failed to create channel", e);
    }
  };

  return (
    <SafeContainer
      header={{
        title: "New chat",
        showBackButton: true,
        onBackPress: () => router.back(),
      }}
    >
      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={!loading ? (
            <Text style={{ textAlign: "center", color: "gray", marginTop: 32 }}>
              No users found.
            </Text>
          ) : null}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => startChat(item.id)}
              style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#e5e7eb" }}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
              ) : (
                <View style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: "#ddd", alignItems: "center", justifyContent: "center" }}>
                  <Text>{item.name?.charAt(0) ?? item.id.charAt(0)}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600" }}>{item.name ?? item.id}</Text>
                <Text style={{ color: "gray", fontSize: 12 }}>{item.id}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeContainer>
  );
};

export default NewChat;