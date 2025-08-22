import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MenuItem from "@components/MenuItem";
// import ColorSchemePopup from "../components/ColorSchemePopup";
// import LanguagePopup from "../components/LanguagePopup";
import { useTheme } from "@contexts/ThemeContext";
// import { translations as en } from "../translations/en";
// import { translations as fr } from "../translations/fr";
// import { translations as ar } from "../translations/ar";
// import { translations as es } from "../translations/es";
// import { translations as de } from "../translations/de";
// import { translations as it } from "../translations/it";
// import { FIREBASE_AUTH } from "../../FirebaseConfig";
// import { RootStackParamList } from "../types";

const Page = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  // const themes = useContext(ThemeContext);
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isDark = useTheme();

  // const translationsMap: Record<string, typeof en> = {
  //   English: en,
  //   French: fr,
  //   Arabic: ar,
  //   Spanish: es,
  //   German: de,
  //   Italian: it,
  // };

  // const selectedTranslations = translationsMap[selectedLanguage];

  const backgroundColor = isDark ? "#171717" : "rgb(249, 249, 249)";
  const headerTextColor = isDark ? "rgb(249, 249, 249)" : "#171717";

  // const handleColorSchemeSelect = (scheme: string) => {
  //   // Update the theme when a new scheme is selected
  //   themes.toggleTheme(scheme as ThemeMode);
  // };

  // const handleLanguageSelect = (language: string) => {
  //   // Handle language selection logic here
  //   console.log(`Selected language: ${language}`);
  // };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      console.log("Logging out");
    } catch (error) {
      console.error("Error during logout", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#171717" : "rgb(249, 249, 249)"}
      />
      <View style={[styles.header, { top: insets.top, backgroundColor: backgroundColor }]}>
        <View style={styles.headerLeftContainer} />
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: headerTextColor }]}>Settings</Text>
        </View>
        <View style={styles.headerRightContainer} />
      </View>

      <ScrollView
        style={[styles.scrollViewContainer, { top: insets.top, backgroundColor: backgroundColor }]}
        contentContainerStyle={{ paddingTop: 60 }}
        scrollEnabled={!modalVisible}
      >
        {/* Profile Section */}
        <Text style={styles.firstSectionTitle}>Profile</Text>
        <View style={styles.section}>
          <MenuItem
            icon="mail-outline"
            title="Email"
            value="217acenmed653@gmail.com"
            isFirst
            isLast={false}
            showValue={true}
            showChevron={false}
          />
          <MenuItem
            icon="logo-google"
            title="Google"
            value="Connected"
            isFirst={false}
            isLast
            showValue={true}
            showChevron={false}
          />
        </View>
        {/* About Section */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.section}>
          <MenuItem icon="document-text-outline" title="Terms of Use" isFirst isLast={false} />
          <MenuItem
            icon="shield-outline"
            title="Privacy Policy"
            value=""
            isFirst={false}
            isLast={false}
            showValue={true}
            showChevron={true}
          />
          <MenuItem
            icon="information-circle-outline"
            title="Check for Updates"
            value="1.0.11(48)"
            isFirst={false}
            isLast
            showValue={true}
            showChevron={true}
          />
        </View>
        {/* App Section */}
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.section}>
          <MenuItem
            icon={
              isDark
                ? "moon-outline"
                  : "sunny-outline"
            }
            title="Color Scheme"
            value={isDark ? "Dark" : "Light"}
            isFirst
            isLast={false}
            showValue={true}
            showChevron={true}
            onPress={() => setModalVisible(true)}
          />
          <MenuItem
            icon="earth"
            title="App Language"
            value="English"
            isFirst={false}
            isLast
            showValue={true}
            showChevron={true}
            onPress={() => setLanguageModalVisible(true)}
          />
        </View>
        {/* Contact Section */}
        <View style={styles.miniSection}>
          <MenuItem icon="chatbubble-outline" title="Contact Us" isFirst isLast />
        </View>
        {/* Danger Zone */}
        <View style={styles.miniSection}>
          <MenuItem
            icon="log-out-outline"
            title="Log Out"
            isDanger
            isFirst
            showChevron={false}
            onPress={handleLogout}
            loading={logoutLoading}
          />
          <MenuItem
            icon="person-remove-outline"
            title="Delete Account"
            isDanger
            isLast
            showChevron={false}
          />
        </View>
        <Text style={styles.footerText}>Footer Text</Text>
      </ScrollView>
      {/* <ColorSchemePopup
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleColorSchemeSelect}
      />
      <LanguagePopup
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        onSelect={handleLanguageSelect}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 5,
    backgroundColor: "#171717",
    zIndex: 1,
    elevation: 3,
  },
  headerLeftContainer: {
    width: 28,
    alignItems: "flex-start",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerRightContainer: {
    width: 28,
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  firstSectionTitle: {
    color: "#666666",
    fontSize: 12,
    marginLeft: 35,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#666666",
    fontSize: 12,
    marginLeft: 35,
    marginTop: 16,
    marginBottom: 8,
  },
  section: {
    marginHorizontal: 20,
    backgroundColor: "#2A2A2A",
    borderRadius: 18,
    marginBottom: 8,
  },
  miniSection: {
    marginHorizontal: 20,
    backgroundColor: "#2A2A2A",
    borderRadius: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  footerText: {
    color: "#666666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 130,
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: "#171717",
  },
});

export default Page;
