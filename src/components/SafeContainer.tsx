import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
  View,
  ViewStyle,
  // Platform,
  StatusBar,
  // SafeAreaView,
  Text,
  TouchableOpacity,
  TextStyle,
  // TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { SparklesIcon as SparklesIconMicro } from "react-native-heroicons/micro";
// // Old solid style from heroicons v1
// import { SparklesIcon as SparklesIconMini } from "react-native-heroicons/mini";
// import { SparklesIcon } from "react-native-heroicons/solid";
// import { SparklesIcon as SparklesIconOutline } from "react-native-heroicons/outline";
// import { ChevronLeftIcon } from "react-native-heroicons/mini";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
// import { StatusBar } from "expo-status-bar";

interface HeaderProps {
  title?: string;
  titleComponent?: React.ReactNode;
  showBackButton?: boolean;
  leftComponent?: React.ReactNode;
  rightOptions?: boolean;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
  onRightOptionsPress?: () => void;
  titleStyle?: TextStyle;
  headerStyle?: ViewStyle;
  bottomComponent?: React.ReactNode;
}

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
  header?: HeaderProps;
}

const SafeContainer: React.FC<SafeContainerProps> = ({ children, style, className, header }) => {
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Default back functionality with haptic feedback
  const handleBackPress = () => {
    (global as any).hapticClick();
    if (header?.onBackPress) {
      header.onBackPress();
    } else {
      router.back();
    }
  };

  if (header) {
    return (
      <View style={[{ flex: 1 }, style]}>
        {/* Header with status bar area */}
        <View
          style={[
            {
              // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
              // paddingTop: insets.top,
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
            header.headerStyle,
          ]}
          className="border-b border-border bg-card"
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: header.bottomComponent ? 0 : -10,
            }}
          >
            {/* Left Section */}
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              {header.showBackButton ? (
                <View>
                  <TouchableWithoutFeedback onPress={handleBackPress}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
                  </TouchableWithoutFeedback>
                </View>
              ) : header.leftComponent ? (
                header.leftComponent
              ) : null}
            </View>

            {/* Title Section */}
            {(header.titleComponent || header.title) && (
              <View style={{ flex: 7, alignItems: "center" }}>
                {header.titleComponent ? (
                  header.titleComponent
                ) : (
                  <Text
                    style={[{ fontSize: 18, fontWeight: "600" }, header.titleStyle]}
                    className="text-foreground"
                    numberOfLines={1}
                  >
                    {header.title}
                  </Text>
                )}
              </View>
            )}

            {/* Right Section */}
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              {header.rightComponent ? (
                header.rightComponent
              ) : header.rightOptions ? (
                <TouchableOpacity onPress={header.onRightOptionsPress}>
                  <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    className="text-foreground"
                    color={isDark ? "white" : "black"}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Optional bottom component below header row */}
          {header.bottomComponent && <View>{header.bottomComponent}</View>}
        </View>

        {/* Content area */}
        <View className={`flex-1 bg-background ${className}`}>{children}</View>
      </View>
    );
  }

  // Original SafeContainer without header
  return (
    <View
      style={[
        {
          // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          // paddingTop: insets.top,
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
      className="flex-1 bg-background"
    >
      <View className={`flex-1 bg-background ${className}`}>{children}</View>
    </View>
  );
};

export default SafeContainer;
