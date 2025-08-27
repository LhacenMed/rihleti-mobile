import React, { useState, useEffect } from "react";
import { View, ViewStyle } from "react-native";
import { WebView } from "react-native-webview";
import { supabase } from "@lib/supabase";

// Simple table schema:
// CREATE TABLE app_config (
//   id TEXT PRIMARY KEY DEFAULT 'loader',
//   html_content TEXT NOT NULL,
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

let cachedLoaderHTML: string | null = null;

// Store your loader HTML in Supabase (call this once)
export const storeLoaderInSupabase = async () => {
  const loaderHTML = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: transparent;
    }
    .loader {
      width: var(--size, 15px);
      height: var(--size, 15px);
      border-radius: 50%;
      display: inline-block;
      border-top: 2px solid var(--color, #FFF);
      border-right: 2px solid transparent;
      box-sizing: border-box;
      animation: rotation .3s linear infinite;
    }
    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <span class="loader"></span>
</body>
</html>`;

  const { error } = await supabase.from("app_config").upsert({
    id: "loader",
    html_content: loaderHTML,
  });

  if (error) {
    console.error("Error storing loader:", error);
  }
};

// Load loader HTML from Supabase on app start
export const loadLoaderFromSupabase = async (): Promise<void> => {
  if (cachedLoaderHTML) return; // Already cached

  const { data, error } = await supabase
    .from("app_config")
    .select("html_content")
    .eq("id", "loader")
    .single();

  if (error) {
    console.error("Error loading loader:", error);
    return;
  }

  cachedLoaderHTML = data?.html_content || null;
};

const Loader = ({
  color = "#FFF",
  size = 15,
  style,
}: {
  color?: string;
  size?: number;
  style?: ViewStyle;
}) => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const getHTML = async () => {
      // Try to use cached version first
      if (!cachedLoaderHTML) {
        await loadLoaderFromSupabase();
      }

      if (cachedLoaderHTML) {
        // Replace CSS variables with actual values
        const customizedHTML = cachedLoaderHTML
          .replace(/var\(--size, 15px\)/g, `${size}px`)
          .replace(/var\(--color, #FFF\)/g, color);

        setHtmlContent(customizedHTML);
      }
    };

    getHTML();
  }, [color, size]);

  if (!htmlContent) {
    return <View style={{ width: size, height: size, ...style }} />;
  }

  return (
    <View style={{ width: size, height: size, ...style }}>
      <WebView
        source={{ html: htmlContent }}
        style={{ backgroundColor: "transparent" }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        javaScriptEnabled={false}
      />
    </View>
  );
};

export default Loader;
