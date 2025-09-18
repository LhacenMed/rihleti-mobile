import { StreamChat } from "stream-chat";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseServiceRole = Constants.expoConfig?.extra?.supabaseServiceRole;
const streamApiKey = Constants.expoConfig?.extra?.streamApiKey;
const streamApiSecret = Constants.expoConfig?.extra?.streamApiSecret;

const supabaseAdmin = createClient(
  supabaseUrl!,
  supabaseServiceRole! // this is secret, only on server
);

const streamServer = StreamChat.getInstance(
  streamApiKey!,
  streamApiSecret! // secret, only on server
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { access_token } = body;
    if (!access_token) {
      return new Response(JSON.stringify({ error: "Missing access token" }), { status: 400 });
    }

    // Verify Supabase session from the access token
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(access_token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid Supabase session or user not found" }), {
        status: 401,
      });
    }

    const userId = user.id;
    // you can get name, avatar, etc from user.user_metadata
    const name = (user.user_metadata && (user.user_metadata as any).name) ?? "Anonymous";
    const email = user.email ?? undefined;
    const avatar = (user.user_metadata && (user.user_metadata as any).avatar) ?? undefined;

    // Generate Stream token
    const token = streamServer.createToken(userId);

    // Upsert the user in Stream — ensures the user exists (with metadata)
    await streamServer.upsertUser({
      id: userId,
      name,
      email,
      avatar,
    });

    return new Response(
      JSON.stringify({
        token,
        user: {
          id: userId,
          name,
          email,
          avatar,
        },
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in Stream token API:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
    });
  }
}
