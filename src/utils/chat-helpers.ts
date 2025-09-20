// utils/chat-helpers.ts
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export type ChannelRow = {
  id: string;
  client_id: string;
  agency_id: string;
  title: string | null;
  created_at: string;
  client_name?: string | null;
  agency_name?: string | null;
};

export async function fetchMyChannels(): Promise<ChannelRow[]> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const authUserId = sessionData?.session?.user?.id;
    if (!authUserId) return [];

    // fetch my client row (if any)
    const [{ data: clientRow }, { data: agencyRow }] = await Promise.all([
      supabase.from("clients").select("id,name").eq("auth_id", authUserId).maybeSingle(),
      supabase.from("agencies").select("id,name").eq("auth_id", authUserId).maybeSingle(),
    ]);

    const clientId = clientRow?.id ?? null;
    const agencyId = agencyRow?.id ?? null;

    if (!clientId && !agencyId) return [];

    // Build filter
    let query = supabase
      .from("channels")
      .select("id,client_id,agency_id,title,created_at")
      .order("created_at", { ascending: false });
    if (clientId && agencyId) {
      query = query.or(`client_id.eq.${clientId},agency_id.eq.${agencyId}`);
    } else if (clientId) {
      query = query.eq("client_id", clientId);
    } else if (agencyId) {
      query = query.eq("agency_id", agencyId);
    }

    const { data: channels, error } = await query;
    if (error || !channels) return [];

    // collect client/agency ids to fetch names
    const clientIds = Array.from(new Set(channels.map((c: any) => c.client_id)));
    const agencyIds = Array.from(new Set(channels.map((c: any) => c.agency_id)));

    const [clientsRes, agenciesRes] = await Promise.all([
      clientIds.length
        ? supabase.from("clients").select("id,name").in("id", clientIds)
        : Promise.resolve({ data: [] }),
      agencyIds.length
        ? supabase.from("agencies").select("id,name").in("id", agencyIds)
        : Promise.resolve({ data: [] }),
    ]);

    const clientsMap = new Map((clientsRes.data || []).map((c: any) => [c.id, c.name]));
    const agenciesMap = new Map((agenciesRes.data || []).map((a: any) => [a.id, a.name]));

    const rows: ChannelRow[] = (channels || []).map((c: any) => ({
      id: c.id,
      client_id: c.client_id,
      agency_id: c.agency_id,
      title: c.title,
      created_at: c.created_at,
      client_name: clientsMap.get(c.client_id) ?? null,
      agency_name: agenciesMap.get(c.agency_id) ?? null,
    }));

    return rows;
  } catch (err) {
    console.warn("fetchMyChannels error", err);
    return [];
  }
}

export async function createChannelAndOpen(agencyId: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;
  if (!accessToken) throw new Error("Not authenticated");

  const res = await fetch("/api/create-channel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ agency_id: agencyId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to create channel");
  }

  const { channel } = await res.json();
  const cid = `messaging:${channel.id}`;
  router.push({
    pathname: "/(app)/chat/[cid]",
    params: { cid },
  });
}
