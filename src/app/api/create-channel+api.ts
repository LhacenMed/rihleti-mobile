// app/api/create-channel+api.ts
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseServiceRole = Constants.expoConfig?.extra?.supabaseServiceRole;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("Missing Supabase server config in expo config");
}

const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceRole!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const agency_id = body?.agency_id;
    const title = body?.title ?? null;

    if (!agency_id) {
      return new Response(JSON.stringify({ error: "agency_id is required" }), { status: 400 });
    }

    const authHeader = request.headers.get("authorization") || "";
    const accessToken = authHeader.replace("Bearer ", "").trim();
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
      });
    }

    // Validate Supabase token and get user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(accessToken);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401 });
    }
    const authUserId = userData.user.id;

    // Map to client row (clients.auth_id => auth.users.id)
    const { data: clientRow, error: clientErr } = await supabaseAdmin
      .from("clients")
      .select("id, name, auth_id")
      .eq("auth_id", authUserId)
      .maybeSingle();

    if (clientErr) {
      return new Response(JSON.stringify({ error: clientErr.message }), { status: 500 });
    }
    if (!clientRow) {
      return new Response(JSON.stringify({ error: "Only clients can create channels" }), {
        status: 403,
      });
    }
    const client_id = clientRow.id;

    // Ensure agency exists
    const { data: agencyRow } = await supabaseAdmin
      .from("agencies")
      .select("id, name")
      .eq("id", agency_id)
      .maybeSingle();

    if (!agencyRow) {
      return new Response(JSON.stringify({ error: "Agency not found" }), { status: 404 });
    }

    // See if channel already exists
    const { data: existing } = await supabaseAdmin
      .from("channels")
      .select("*")
      .eq("client_id", client_id)
      .eq("agency_id", agency_id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ channel: existing }), { status: 200 });
    }

    // Create new channel (service role key so no RLS friction)
    const { data: newChannel, error: insertErr } = await supabaseAdmin
      .from("channels")
      .insert({
        client_id,
        agency_id,
        title,
      })
      .select()
      .single();

    if (insertErr) {
      // Race condition fallback: return existing
      const { data: existingAfterErr } = await supabaseAdmin
        .from("channels")
        .select("*")
        .eq("client_id", client_id)
        .eq("agency_id", agency_id)
        .maybeSingle();

      if (existingAfterErr) {
        return new Response(JSON.stringify({ channel: existingAfterErr }), { status: 200 });
      }
      return new Response(JSON.stringify({ error: insertErr.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ channel: newChannel }), { status: 200 });
  } catch (err: any) {
    console.error("create-channel error:", err);
    return new Response(JSON.stringify({ error: err?.message ?? "Server error" }), { status: 500 });
  }
}
