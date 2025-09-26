import React from "react";
import { Alert, Text, View } from "react-native";
import SafeContainer from "@/components/SafeContainer";
import { OverflowMenuView } from "modules/overflow-menu";

export default function OverflowMenuExampleScreen() {
  return (
    <SafeContainer>
      <View className="flex-1 bg-background">
        {/* Native Toolbar integrated as the app bar */}
        <OverflowMenuView
          title="Overflow Menu (Native)"
          style={{ width: "100%", height: 56 }}
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

        <View className="flex-1 items-center justify-center p-5">
          <Text className="mb-4 text-lg text-foreground">This screen uses a real Toolbar and MenuProvider.</Text>
          <Text className="text-foreground">Tap the ⋮ overflow icon in the toolbar to open the native menu.</Text>
        </View>
      </View>
    </SafeContainer>
  );
}
