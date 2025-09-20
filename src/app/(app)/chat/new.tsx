// app/chat/new.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { supabase } from "@/lib/supabase";
import { createChannelAndOpen } from "@/utils/chat-helpers";
import SafeContainer from "@/components/SafeContainer";

export default function NewChannelScreen() {
  const [agencies, setAgencies] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("id,name")
        .order("name", { ascending: true })
        .limit(50);
      if (!error) setAgencies(data || []);
    };
    load();
  }, []);

  return (
    <SafeContainer header={{ title: "New Chat" }}>
      <ScrollView className="p-4">
        {agencies.map((ag) => (
          <TouchableOpacity
            key={ag.id}
            className="mb-3 rounded-lg border border-border bg-card p-4"
            onPress={() => createChannelAndOpen(ag.id)}
          >
            <Text className="font-semibold text-foreground">{ag.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeContainer>
  );
}
