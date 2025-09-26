import React from "react";
import { Alert, Text, View } from "react-native";
import SafeContainer from "@/components/SafeContainer";
import { OverflowMenuView } from "modules/overflow-menu";

export default function OverflowMenuExampleScreen() {
  return (
    <SafeContainer style={{ paddingTop: 0 }}>
      <View className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center p-5">
          <Text className="mb-4 text-lg text-foreground">Overflow Menu Example</Text>
          <OverflowMenuView
            style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: "center", justifyContent: "center" }}
            items={[
              { id: "edit", title: "Edit" },
              { id: "share", title: "Share" },
              { id: "delete", title: "Delete", enabled: false },
            ]}
            onItemSelected={(e) => {
              const { id, index, title } = e.nativeEvent;
              Alert.alert("Selected", `${title} (id: ${id ?? "-"}, index: ${index})`);
              console.log("OverflowMenu onItemSelected:", e.nativeEvent);
            }}
          />
        </View>
      </View>
    </SafeContainer>
  );
}