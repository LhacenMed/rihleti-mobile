import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Constants from "expo-constants";
import { supabase } from "@/lib/supabase";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";

interface StreamChatContextValue {
  client: StreamChat | null;
  isConnecting: boolean;
  isConnected: boolean;
  ensureConnected: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const StreamChatContext = createContext<StreamChatContextValue | undefined>(undefined);

export const useStreamChat = () => {
  const ctx = useContext(StreamChatContext);
  if (!ctx) throw new Error("useStreamChat must be used within StreamChatProvider");
  return ctx;
};

const streamApiKey = Constants.expoConfig?.extra?.streamApiKey as string | undefined;

export const StreamChatProvider = ({ children }: { children: React.ReactNode }) => {
  const clientRef = useRef<StreamChat | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Lazily instantiate the client
  if (!clientRef.current && streamApiKey) {
    clientRef.current = StreamChat.getInstance(streamApiKey);
  }

  const ensureConnected = async () => {
    if (!clientRef.current || !streamApiKey) return;
    if ((clientRef.current as any).userID) {
      // already connected
      setIsConnected(true);
      return;
    }
    setIsConnecting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        setIsConnecting(false);
        return;
      }
      const res = await fetch("/api/stream-chat-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });
      if (!res.ok) throw new Error("Failed to fetch Stream token");
      const { token, user } = await res.json();
      await clientRef.current.connectUser(
        { id: user.id, name: user.name, image: user.avatar },
        token
      );
      setIsConnected(true);
    } catch (e) {
      console.warn("Stream connect error:", e);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!clientRef.current) return;
    try {
      await clientRef.current.disconnectUser();
    } finally {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Try to connect once on mount if there is an active Supabase session
    ensureConnected();
    // We don't add ensureConnected as dep to avoid re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ client: clientRef.current, isConnecting, isConnected, ensureConnected, disconnect }),
    [isConnecting, isConnected]
  );

  return (
    <OverlayProvider>
      {clientRef.current ? (
        <Chat client={clientRef.current}>
          <StreamChatContext.Provider value={value}>{children}</StreamChatContext.Provider>
        </Chat>
      ) : (
        <StreamChatContext.Provider value={value}>{children}</StreamChatContext.Provider>
      )}
    </OverlayProvider>
  );
};