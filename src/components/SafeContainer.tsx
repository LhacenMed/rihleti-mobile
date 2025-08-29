import React from "react";
import { View, ViewStyle, Platform, StatusBar, SafeAreaView } from "react-native";

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
}

const SafeContainer: React.FC<SafeContainerProps> = ({ children, style, className }) => (
  <SafeAreaView
    style={[
      {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        // paddingHorizontal: Platform.OS === "android" ? 15 : 0,
        // marginHorizontal: Platform.OS === "ios" ? 10 : 0,
      },
      style,
    ]}
    className="bg-background"
  >
    <View className={`flex-1 bg-background ${className}`}>{children}</View>
  </SafeAreaView>
);

export default SafeContainer;
