import React from "react";
import { View } from "react-native";

interface GroupProps {
  children: React.ReactNode;
  className?: string;
  first?: boolean; // first group has no top separator
}

export const Group: React.FC<GroupProps> = ({ children, className = "", first = false }) => {
  return (
    <View className={`${className}`}>
      {!first && <View className="h-[1px] w-full bg-border" />}
      {children}
    </View>
  );
};
