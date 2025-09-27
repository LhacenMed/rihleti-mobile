import React, { useRef } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { PopupMenu } from "@/components/ui/popup-menu";
import SafeContainer from "@/components/SafeContainer";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function CascadeMenuExampleScreen() {
  const viewMenuRef = useRef<any>(null);

  const items = [
    {
      id: "open",
      title: "Open",
      icon: { resource: "ic_menu_view" },
      useCustomRow: true,
      onSelect: () => console.log("Open selected"),
    },
    {
      id: "edit",
      title: "Edit",
      items: [
        {
          id: "rename",
          title: "Rename",
          icon: { resource: "ic_menu_edit" },
          useCustomRow: true,
          onSelect: () => console.log("Rename selected"),
        },
        {
          id: "move",
          title: "Move to…",
          items: [
            { id: "folder1", title: "Folder 1", onSelect: () => console.log("Move to Folder 1") },
            { id: "folder2", title: "Folder 2", onSelect: () => console.log("Move to Folder 2") },
          ],
        },
      ],
    },
    {
      id: "share",
      title: "Share",
      icon: { resource: "ic_menu_share" },
      useCustomRow: true,
      onSelect: () => console.log("Share selected"),
    },
    {
      id: "delete",
      title: "Delete",
      icon: { resource: "ic_delete" },
      useCustomRow: true,
      enabled: true,
      onSelect: () => console.log("Delete selected"),
    },
  ];

  return (
    <SafeContainer className="p-4" header={{ title: "Cascade Popup Menu" }}>
      <ScrollView>
        <Text className="mb-4 text-foreground">
          Module function anchored to a React Native button:
        </Text>
        <PopupMenu
          items={items}
          style={{ textSizeSp: 15, itemPaddingHorizontalDp: 12, forceCustomRow: true }}
          onDismiss={() => {
            console.log("Dismissed");
          }}
        >
          <Button compact mode="contained-tonal">
            <Ionicons name="ellipsis-vertical" size={20} color="white" />
          </Button>
        </PopupMenu>
        <Text className="mb-4 text-foreground">View-based usage (anchors to itself here):</Text>
        {/* <Pressable
          onPress={() => viewMenuRef.current?.show()}
          style={{ padding: 12, backgroundColor: "#eee", borderRadius: 8, marginBottom: 12 }}
        >
          <Text>Open menu (view.show())</Text>
        </Pressable> */}
        {/* <PopupMenu
          ref={viewMenuRef}
          useNativeView
          items={items}
          style={{ textSizeSp: 15, itemPaddingHorizontalDp: 12, forceCustomRow: true }}
          onDismiss={() => {
            console.log("Dismissed");
          }}
        /> */}
        <View style={{ height: 24 }} />
        <Text style={{ color: "#666" }}>
          Notes: Icons use drawable resource names (e.g. ic_menu_share). To use custom images, pass
          base64 in icon.base64.
        </Text>
      </ScrollView>
    </SafeContainer>
  );
}
