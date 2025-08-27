import React from "react";
import { View, Text, StyleSheet } from "react-native";
// import { Switch } from "react-native-paper";
import { Switch } from "@components/ui/switch";
import { useTheme } from "@contexts/ThemeContext";
import { useFeatures } from "@contexts/FeaturesContext";

const Preferences: React.FC = () => {
  const { isDark } = useTheme();
  const { swipeEnabled, setSwipeEnabled } = useFeatures();
  const [switchValue, setSwitchValue] = React.useState(false);

  const backgroundColor = isDark ? "#171717" : "rgb(249, 249, 249)";
  const sectionBackgroundColor = isDark ? "#2A2A2A" : "#ffffff";
  const sectionTitleColor = "#666666";
  const textColor = isDark ? "#ffffff" : "#000000";

  // const handleSwipeEnabledChange = async (next: boolean) => {
  //   await new Promise((resolve) => setTimeout(resolve, 1500));
  //   setSwipeEnabled(next);
  //   return next;
  // };

  const handleSwitchChange = async (newValue: boolean) => {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSwipeEnabled(newValue);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>Tabs</Text>
      <View style={[styles.section, { backgroundColor: sectionBackgroundColor }]}>
        <View style={styles.row}>
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowTitle, { color: textColor }]}>Swipe Between Tabs</Text>
            <Text style={[styles.rowSubtitle, { color: sectionTitleColor }]}>
              Enable horizontal swipe gestures between tabs
            </Text>
          </View>
          {/* <Switch value={swipeEnabled} onValueChange={handleSwipeEnabledChange} /> */}
          <Switch value={swipeEnabled} onValueChange={handleSwitchChange} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    marginLeft: 35,
    marginTop: 16,
    marginBottom: 8,
  },
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
  rowTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Preferences;
