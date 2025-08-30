import React from "react";
import {
  View,
  ViewStyle,
  Platform,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextStyle,
} from "react-native";

interface HeaderProps {
  title?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftText?: string;
  rightText?: string;
  titleStyle?: TextStyle;
  headerStyle?: ViewStyle;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
  header?: HeaderProps;
}

const SafeContainer: React.FC<SafeContainerProps> = ({ children, style, className, header }) => {
  if (header) {
    return (
      <View style={[{ flex: 1 }, style]}>
        {/* Header with status bar area */}
        <SafeAreaView
          style={[
            { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
            header.headerStyle,
          ]}
          className="bg-background"
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              marginBottom: 16,
            }}
            className="border-b border-border"
          >
            {/* Left Section */}
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              {header.showBackButton ? (
                <TouchableOpacity onPress={header.onBackPress}>
                  <Text className="text-base text-primary">Back</Text>
                </TouchableOpacity>
              ) : header.leftComponent ? (
                header.leftComponent
              ) : header.leftText ? (
                <TouchableOpacity onPress={header.onLeftPress}>
                  <Text className="text-base text-primary">{header.leftText}</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Title Section */}
            {header.title && (
              <View style={{ flex: 2, alignItems: "center" }}>
                <Text
                  style={[{ fontSize: 18, fontWeight: "600" }, header.titleStyle]}
                  className="text-foreground"
                  numberOfLines={1}
                >
                  {header.title}
                </Text>
              </View>
            )}

            {/* Right Section */}
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              {header.rightComponent ? (
                header.rightComponent
              ) : header.rightText ? (
                <TouchableOpacity onPress={header.onRightPress}>
                  <Text className="text-base text-primary">{header.rightText}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </SafeAreaView>

        {/* Content area */}
        <View className={`flex-1 bg-background ${className}`}>{children}</View>
      </View>
    );
  }

  // Original SafeContainer without header
  return (
    <SafeAreaView
      style={[
        {
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
        style,
      ]}
      className="flex-1 bg-background"
    >
      <View className={`flex-1 bg-background ${className}`}>{children}</View>
    </SafeAreaView>
  );
};

export default SafeContainer;
