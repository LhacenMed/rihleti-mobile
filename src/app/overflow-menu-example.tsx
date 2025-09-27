import React, { useRef, useEffect } from "react";
import { View, Text, Pressable, findNodeHandle, ScrollView, Alert } from "react-native";
import SafeContainer from "@/components/SafeContainer";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { OverflowMenuView } from "modules/overflow-menu";
import {
  addOnItemSelectedListener,
  addOnDismissListener,
} from "../../modules/cascade-popup-menu/src/CascadePopupMenuModule";
import { showMenu, type MenuSpec, OnItemSelectedEvent } from "../../modules/cascade-popup-menu";

export default function OverflowMenuExampleScreen() {
  const anchorRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const viewRef = useRef<{ show: () => void }>(null);
  const handleSelected = (e: OnItemSelectedEvent) => {
    switch (e.id) {
      case "open":
        console.log("Open selected", e);
        break;
      case "rename":
        console.log("Rename selected", e);
        break;
      case "move":
        console.log("Move selected", e);
        break;
      case "folder1":
        console.log("Move to Folder 1", e);
        break;
      case "folder2":
        console.log("Move to Folder 2", e);
        break;
      case "share":
        console.log("Share selected", e);
        break;
      case "delete":
        console.log("Delete selected", e);
        break;
      default:
        console.log("Selected", e);
        break;
    }
  };

  useEffect(() => {
    const subSel = addOnItemSelectedListener(handleSelected);
    const subDismiss = addOnDismissListener(() => {
      console.log("Dismissed");
    });
    return () => {
      subSel.remove();
      subDismiss.remove();
    };
  }, []);

  const menu: MenuSpec = {
    items: [
      { id: "open", title: "Open", icon: { resource: "ic_menu_view" }, useCustomRow: true },
      {
        id: "edit",
        title: "Edit",
        items: [
          { id: "rename", title: "Rename", icon: { resource: "ic_menu_edit" }, useCustomRow: true },
          {
            id: "move",
            title: "Move to…",
            items: [
              { id: "folder1", title: "Folder 1" },
              { id: "folder2", title: "Folder 2" },
            ],
          },
        ],
      },
      { id: "share", title: "Share", icon: { resource: "ic_menu_share" }, useCustomRow: true },
      {
        id: "delete",
        title: "Delete",
        icon: { resource: "ic_delete" },
        useCustomRow: true,
        enabled: true,
      },
    ],
  };

  return (
    <SafeContainer
      className="px-4"
      header={{
        title: "Native Menu",
        // bottomComponent: <TripsFilter />,
        rightOptions: true,
        rightComponent: (
          <OverflowMenuView
            style={{
              alignSelf: "flex-end",
            }}
            items={[
              { id: "edit", title: "Edit", icon: "ic_edit" },
              { id: "share", title: "Share", icon: "ic_share" },
              { id: "delete", title: "Delete", enabled: false, icon: "ic_delete" },
            ]}
            renderTrigger={({ openMenu }) => (
              <Button onPress={openMenu} compact>
                <Ionicons name="ellipsis-vertical" size={20} color="white" />
              </Button>
            )}
            onItemSelected={(e) => {
              const { id, index, title } = e.nativeEvent;
              Alert.alert("Selected", `${title} (id: ${id ?? "-"}, index: ${index})`);
              console.log("OverflowMenu onItemSelected:", e.nativeEvent);
            }}
          />
        ),
        showBackButton: true,
        // onBackPress: () => router.back(),
      }}
    >
      <View className="flex-1 bg-background">
        <View className="flex-end flex-1 items-center justify-center p-5">
          <Text className="mb-4 text-lg text-foreground">Overflow Menu Example</Text>
          <OverflowMenuView
            style={{
              alignSelf: "flex-end",
            }}
            items={[
              { id: "edit", title: "Edit", icon: "ic_edit" },
              { id: "share", title: "Share", icon: "ic_share" },
              { id: "delete", title: "Delete", enabled: false, icon: "ic_delete" },
            ]}
            renderTrigger={({ openMenu }) => <Button onPress={openMenu}>More</Button>}
            onItemSelected={(e) => {
              const { id, index, title } = e.nativeEvent;
              Alert.alert("Selected", `${title} (id: ${id ?? "-"}, index: ${index})`);
              console.log("OverflowMenu onItemSelected:", e.nativeEvent);
            }}
          />

          <Button
            ref={anchorRef}
            onPress={() => {
              const anchorTag = findNodeHandle(anchorRef.current) as number;
              showMenu({
                anchorTag,
                menu,
                style: { textSizeSp: 15, itemPaddingHorizontalDp: 12, forceCustomRow: true },
              });
            }}
            compact
            mode="contained-tonal"
            style={{ alignSelf: "flex-end" }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="white" />
          </Button>
        </View>
      </View>
    </SafeContainer>
  );
}
