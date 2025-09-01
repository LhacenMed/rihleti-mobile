import React from "react";
import { View, ViewProps } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface LoaderProps extends ViewProps {
  size?: number;
  color?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 30,
  color = "#fff",
  className = "",
  ...props
}) => {
  const { isDark } = useTheme();
  return (
    <View className={className} {...props}>
      <LottieView
        source={require("@/assets/lottie/loader.json")}
        style={{
          width: size,
          height: size,
        }}
        autoPlay
        loop
        speed={4}
        colorFilters={[
          {
            keypath: "loader",
            color: color,
          },
        ]}
      />
    </View>
  );
};

export { Loader };
