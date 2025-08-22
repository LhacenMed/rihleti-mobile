import { useTheme } from "@contexts/ThemeContext";
import React, { useContext, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptic from "expo-haptics";
// import ReactNativeHapticFeedback from "react-native-haptic-feedback";

interface MenuItemProps {
  icon?: string;
  title: string;
  subtitle?: string;
  value?: string;
  isFirst?: boolean;
  isLast?: boolean;
  isDanger?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  showValue?: boolean;
  showChevron?: boolean;
  loading?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  isFirst,
  isLast,
  isDanger,
  onPress,
  disabled,
  showValue = true,
  showChevron = true,
  loading = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // const themes = useContext(ThemeContext);
  const { isDark } = useTheme();

  const backgroundColor = isDark ? "#1E1E1E" : "#ffffff";
  const dimBackgroundColor = isDark ? "#2A2A2A" : "rgb(241, 241, 241)";
  const dangerDimBackgroundColor = isDark ? "#2A1F1F" : "#FFE8E8";
  const borderBottomColor = isDark ? "#404040" : "rgb(210, 210, 210)";
  const normalTextColor = isDark ? "#ffffff" : "#171717";
  const dangerTextColor = isDark ? "#FF4545" : "#FF4545";
  const valueTextColor = isDark ? "#666666" : "rgb(142, 142, 142)";
  const chevronColor = isDark ? "#666666" : "rgb(142, 142, 142)";

  const handlePressIn = () => {
    setIsPressed(true);
    // const options = {
    //   enableVibrateFallback: true,
    //   ignoreAndroidSystemSettings: false,
    // };
    if (isDanger) {
      // Use native notification haptic for danger/warning context
      Haptic.notificationAsync(Haptic.NotificationFeedbackType.Warning);
      // ReactNativeHapticFeedback.trigger("effectClick");
      // ReactNativeHapticFeedback.trigger("effectClick", options);
    } else {
      // Use native impact haptic for regular interactions
      // Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      useNativeDriver: false,
      duration: 0,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      useNativeDriver: false,
      duration: 200,
    }).start();
  };

  const animatedBackgroundColor = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [backgroundColor, isDanger ? dangerDimBackgroundColor : dimBackgroundColor],
  });

  const containerStyle = {
    ...styles.menuItem,
    borderTopLeftRadius: isFirst ? 17 : 0,
    borderTopRightRadius: isFirst ? 17 : 0,
    borderBottomLeftRadius: isLast ? 17 : 0,
    borderBottomRightRadius: isLast ? 17 : 0,
    borderBottomWidth: isLast ? 0 : 1,
    borderBottomColor: borderBottomColor,
    backgroundColor: animatedBackgroundColor,
  };

  const textColor = isDanger ? dangerTextColor : normalTextColor;

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={loading || disabled}
    >
      <Animated.View style={containerStyle}>
        <View style={styles.menuItemLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={(icon as any) || ""} size={20} color={textColor} style={styles.icon} />
          </View>
          <View>
            <Text style={[styles.menuItemTitle, { color: textColor }]}>{title}</Text>
            {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.menuItemRight}>
          {showValue && value && (
            <Text style={[styles.menuItemValue, { color: valueTextColor }]}>{value}</Text>
          )}
          {showChevron ? (
            <Ionicons name="chevron-forward" size={20} color={chevronColor} />
          ) : loading ? (
            <ActivityIndicator size="small" color={chevronColor} />
          ) : null}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2A2A2A",
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 14,
  },
  menuItemSubtitle: {
    fontSize: 12,
    marginTop: 4,
    color: "#AAAAAA",
  },
  menuItemValue: {
    color: "#666666",
    fontSize: 14,
    marginRight: 8,
  },
  iconContainer: {
    width: 40,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MenuItem;
