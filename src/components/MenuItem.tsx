import { useTheme } from "@contexts/ThemeContext";
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Loader from "./ui/loader";

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
  const { isDark } = useTheme();

  const backgroundColor = isDark ? "#1E1E1E" : "#ffffff";
  // const dimBackgroundColor = isDark ? "#2A2A2A" : "rgb(241, 241, 241)";
  // const dangerDimBackgroundColor = isDark ? "#2A1F1F" : "#FFE8E8";
  const borderBottomColor = isDark ? "#404040" : "rgb(210, 210, 210)";
  const normalTextColor = isDark ? "#ffffff" : "#171717";
  const dangerTextColor = isDark ? "red" : "red";
  const valueTextColor = isDark ? "#666666" : "rgb(142, 142, 142)";
  const chevronColor = isDark ? "#666666" : "rgb(142, 142, 142)";

  const containerStyle = {
    ...styles.menuItem,
    borderTopLeftRadius: isFirst ? 17 : 0,
    borderTopRightRadius: isFirst ? 17 : 0,
    borderBottomLeftRadius: isLast ? 17 : 0,
    borderBottomRightRadius: isLast ? 17 : 0,
    borderBottomWidth: isLast ? 0 : 1,
    borderBottomColor: borderBottomColor,
    backgroundColor: backgroundColor,
  };

  const textColor = isDanger ? dangerTextColor : normalTextColor;
  // const rippleColor = isDanger ? dangerDimBackgroundColor : dimBackgroundColor;

  return (
    <View style={containerStyle}>
      <Button
        mode="text"
        onPress={onPress}
        disabled={loading || disabled}
        // Remove loading={loading} from Button - handle loading ourselves
        textColor={isDanger ? "red" : "darkgray"}
        // rippleColor={rippleColor}
        contentStyle={styles.buttonContent}
        style={styles.button}
        labelStyle={{ opacity: 0 }} // Hide the default label since we're using custom content
        compact
      >
        <View style={styles.menuItemContent} pointerEvents="none">
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={(icon as any) || ""}
                size={20}
                color={textColor}
                style={styles.icon}
              />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[styles.menuItemTitle, { color: textColor }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
              {subtitle && (
                <Text style={styles.menuItemSubtitle} numberOfLines={1} ellipsizeMode="tail">
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.menuItemRight}>
            {showValue && value && !loading && (
              <Text
                style={[styles.menuItemValue, { color: valueTextColor }]}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {value}
              </Text>
            )}
            {loading ? (
              // <ActivityIndicator
              //   size="small"
              //   color={chevronColor}
              //   style={styles.loadingIndicator}
              // />
              <Loader style={{ marginRight: 5 }} color={chevronColor} size={15} />
            ) : showChevron ? (
              <Ionicons name="chevron-forward" size={20} color={chevronColor} />
            ) : null}
          </View>
        </View>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    backgroundColor: "hsl(var(--modal-background))",
    borderBottomWidth: 1,
    overflow: "hidden", // Ensures the ripple effect respects border radius
  },
  button: {
    borderRadius: 0,
    margin: 0,
    backgroundColor: "transparent",
  },
  buttonContent: {
    // paddingHorizontal: 5,
    // paddingVertical: 5,
    minHeight: 50,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  menuItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0, // Important: allows flex child to shrink below its content size
    marginRight: 5, // Space between left content and right content
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0, // Prevent right side from shrinking
    marginRight: -10,
  },
  textContainer: {
    flex: 1,
    minWidth: 0, // Important: allows text to shrink and be truncated
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
    maxWidth: 150, // Limit value text width
  },
  iconContainer: {
    width: 32,
    height: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    flexShrink: 0, // Prevent icon from shrinking
  },
  loadingIndicator: {
    marginRight: 8,
  },
});

export default MenuItem;

// Fallback for Pressable
/*
import { useTheme } from "@contexts/ThemeContext";
import React, { useContext, useState, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  const { isDark } = useTheme();

  const backgroundColor = isDark ? "#1E1E1E" : "#ffffff";
  const dimBackgroundColor = isDark ? "#2A2A2A" : "rgb(241, 241, 241)";
  const dangerDimBackgroundColor = isDark ? "#2A1F1F" : "#FFE8E8";
  const borderBottomColor = isDark ? "#404040" : "rgb(210, 210, 210)";
  const normalTextColor = isDark ? "#ffffff" : "#171717";
  const dangerTextColor = isDark ? "#FF4545" : "#FF4545";
  const valueTextColor = isDark ? "#666666" : "rgb(142, 142, 142)";
  const chevronColor = isDark ? "#666666" : "rgb(142, 142, 142)";

  const containerStyle = {
    ...styles.menuItem,
    borderTopLeftRadius: isFirst ? 17 : 0,
    borderTopRightRadius: isFirst ? 17 : 0,
    borderBottomLeftRadius: isLast ? 17 : 0,
    borderBottomRightRadius: isLast ? 17 : 0,
    borderBottomWidth: isLast ? 0 : 1,
    borderBottomColor: borderBottomColor,
    backgroundColor: backgroundColor,
  };

  const textColor = isDanger ? dangerTextColor : normalTextColor;
  const rippleColor = isDanger ? dangerDimBackgroundColor : dimBackgroundColor;

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={onPress}
        disabled={loading || disabled}
        style={styles.pressable}
        android_ripple={{
          color: rippleColor,
          borderless: false,
        }}
      >
        <View style={styles.menuItemContent} pointerEvents="none">
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={(icon as any) || ""}
                size={20}
                color={textColor}
                style={styles.icon}
              />
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
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    backgroundColor: "hsl(var(--modal-background))",
    borderBottomWidth: 1,
    overflow: "hidden", // Ensures the ripple effect respects border radius
  },
  pressable: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    minHeight: 50,
  },
  menuItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: -5,
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
    width: 32,
    height: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default MenuItem;

*/
