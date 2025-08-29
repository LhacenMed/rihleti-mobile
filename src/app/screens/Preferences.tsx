import React, { useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Switch, SwitchRef } from "@components/ui/switch";
import MenuItem from "@components/MenuItem";
import { useTheme } from "@contexts/ThemeContext";
import { useFeatures } from "@contexts/FeaturesContext";

export default function Preferences() {
  const { isDark } = useTheme();
  const { swipeEnabled, setSwipeEnabled } = useFeatures();
  const [switchLoading, setSwitchLoading] = React.useState(false);
  const switchRef = useRef<SwitchRef>(null);

  const backgroundColor = isDark ? "#171717" : "rgb(249, 249, 249)";
  const sectionTitleColor = "#666666";

  const handleSwitchChange = async (newValue: boolean) => {
    setSwitchLoading(true);
    // await new Promise((r) => setTimeout(r, 1000));
    setSwipeEnabled(newValue);
    setSwitchLoading(false);
  };

  const handleMenuItemPress = () => {
    if (switchLoading) return;
    switchRef.current?.triggerPress();
  };

  const handleMenuItemPressIn = () => {
    if (switchLoading) return;
    switchRef.current?.onPressIn();
  };

  const handleMenuItemPressOut = () => {
    if (switchLoading) return;
    switchRef.current?.onPressOut();
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>Tabs</Text>
      {/* <View style={[styles.section, { backgroundColor: sectionBackgroundColor }]}>
        <Pressable
          style={styles.row}
          onPress={triggerFromButton}
          disabled={switchLoading}
          android_ripple={{ color: "gray" }}
        >
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowTitle, { color: textColor }]}>Swipe Between Tabs</Text>
            <Text style={[styles.rowSubtitle, { color: sectionTitleColor }]}>
              Enable horizontal swipe gestures between tabs
            </Text>
          </View>
          <Switch value={swipeEnabled} onValueChange={handleSwitchChange} loading={switchLoading} />
        </Pressable>
      </View> */}
      <MenuItem
        title="Swipe Between Tabs"
        subtitle="Allow horizontal tab swipes"
        onPress={handleMenuItemPress}
        onPressIn={handleMenuItemPressIn}
        onPressOut={handleMenuItemPressOut}
        disabled={switchLoading}
        isLast
        isFirst
        style={{ paddingVertical: 10 }}
        containerStyle={{ marginHorizontal: 20 }}
        rightAction={
          <Switch
            ref={switchRef}
            value={swipeEnabled}
            onValueChange={handleSwitchChange}
            loading={switchLoading}
            style={{ marginRight: 10 }}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { fontSize: 12, marginLeft: 35, marginTop: 16, marginBottom: 8 },
  section: {
    marginHorizontal: 20,
    borderRadius: 18,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  rowTextContainer: { flex: 1, paddingRight: 12 },
  rowTitle: { fontSize: 16, fontWeight: "600" },
  rowSubtitle: { fontSize: 12, marginTop: 4 },
});
