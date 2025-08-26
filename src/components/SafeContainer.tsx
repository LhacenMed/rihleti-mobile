import React from "react";
import { View, ViewStyle, Platform, StatusBar } from "react-native";

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
}

const SafeContainer: React.FC<SafeContainerProps> = ({ children, style, className }) => (
  <View
    style={[
      {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      },
      style,
    ]}
    className={`bg-background ${className}`}
  >
    {children}
  </View>
);

export default SafeContainer;
