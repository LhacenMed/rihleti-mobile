// import { useTheme } from "@contexts/ThemeContext";
// import React from "react";
// import { View, Text, StyleSheet, ActivityIndicator, ViewStyle, StyleProp } from "react-native";
// import { Button } from "react-native-paper";
// import { Ionicons } from "@expo/vector-icons";
// import Loader from "./ui/loader";

// interface MenuItemProps {
//   icon?: string;
//   title: string;
//   subtitle?: string;
//   value?: string;
//   isFirst?: boolean;
//   isLast?: boolean;
//   isDanger?: boolean;
//   onPress?: () => void;
//   disabled?: boolean;
//   showValue?: boolean;
//   showChevron?: boolean;
//   loading?: boolean;
//   style?: StyleProp<ViewStyle>;
//   // Apply styles to the OUTER container (use this for margins)
//   containerStyle?: StyleProp<ViewStyle>;
//   // Optional right-side action (e.g., a Switch). When provided, it replaces
//   // the default value/loading/chevron section and remains interactive.
//   rightAction?: React.ReactNode;
//   rightActionContainerStyle?: StyleProp<ViewStyle>;
//   // If true, removes the ripple effect on press
//   disableRipple?: boolean;
// }

// const MenuItem: React.FC<MenuItemProps> = ({
//   icon,
//   title,
//   subtitle,
//   value,
//   isFirst,
//   isLast,
//   isDanger,
//   onPress,
//   disabled,
//   showValue = true,
//   showChevron = true,
//   loading = false,
//   style,
//   containerStyle,
//   rightAction,
//   rightActionContainerStyle,
//   disableRipple = false,
// }) => {
//   const { isDark } = useTheme();

//   const backgroundColor = isDark ? "#1E1E1E" : "#ffffff";
//   // const dimBackgroundColor = isDark ? "#2A2A2A" : "rgb(241, 241, 241)";
//   // const dangerDimBackgroundColor = isDark ? "#2A1F1F" : "#FFE8E8";
//   const borderBottomColor = isDark ? "#404040" : "rgb(210, 210, 210)";
//   const normalTextColor = isDark ? "#ffffff" : "#171717";
//   const dangerTextColor = isDark ? "red" : "red";
//   const valueTextColor = isDark ? "#666666" : "rgb(142, 142, 142)";
//   const chevronColor = isDark ? "#666666" : "rgb(142, 142, 142)";

//   const computedContainerStyle = {
//     ...styles.menuItem,
//     borderTopLeftRadius: isFirst ? 17 : 0,
//     borderTopRightRadius: isFirst ? 17 : 0,
//     borderBottomLeftRadius: isLast ? 17 : 0,
//     borderBottomRightRadius: isLast ? 17 : 0,
//     borderBottomWidth: isLast ? 0 : 1,
//     borderBottomColor: borderBottomColor,
//     backgroundColor: backgroundColor,
//   };

//   const textColor = isDanger ? dangerTextColor : normalTextColor;
//   // const rippleColor = isDanger ? dangerDimBackgroundColor : dimBackgroundColor;

//   return (
//     <View style={[computedContainerStyle, containerStyle, styles.container]}>
//       <Button
//         mode="text"
//         onPress={onPress}
//         disabled={loading || disabled}
//         // Remove loading={loading} from Button - handle loading ourselves
//         textColor={isDanger ? "red" : "darkgray"}
//         rippleColor={disableRipple ? "transparent" : undefined}
//         contentStyle={styles.buttonContent}
//         style={[styles.button]}
//         labelStyle={{ opacity: 0 }} // Hide the default label since we're using custom content
//         compact
//       >
//         <View style={[styles.menuItemContent, style]}>
//           <View style={styles.menuItemLeft}>
//             {icon && (
//               <View style={styles.iconContainer}>
//                 <Ionicons
//                   name={(icon as any) || ""}
//                   size={20}
//                   color={textColor}
//                   style={styles.icon}
//                 />
//               </View>
//             )}
//             <View style={styles.textContainer}>
//               <Text
//                 style={[styles.menuItemTitle, { color: textColor }]}
//                 numberOfLines={1}
//                 ellipsizeMode="tail"
//               >
//                 {title}
//               </Text>
//               {subtitle && (
//                 <Text
//                   style={styles.menuItemSubtitle}
//                   // numberOfLines={1}
//                   // ellipsizeMode="tail"
//                 >
//                   {subtitle}
//                 </Text>
//               )}
//             </View>
//           </View>
//           {rightAction ? (
//             <View
//               style={[styles.menuItemRight, rightActionContainerStyle]}
//               pointerEvents="box-none"
//             >
//               <View style={styles.rightActionWrapper} pointerEvents="box-only">
//                 {rightAction}
//               </View>
//             </View>
//           ) : (
//             <View style={styles.menuItemRight} pointerEvents="none">
//               {showValue && value && !loading && (
//                 <Text
//                   style={[styles.menuItemValue, { color: valueTextColor }]}
//                   numberOfLines={1}
//                   ellipsizeMode="middle"
//                 >
//                   {value}
//                 </Text>
//               )}
//               {loading ? (
//                 <Loader style={{ marginRight: 5 }} color={chevronColor} size={15} />
//               ) : showChevron ? (
//                 <Ionicons name="chevron-forward" size={20} color={chevronColor} />
//               ) : null}
//             </View>
//           )}
//         </View>
//       </Button>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // paddingHorizontal: 10,
//   },
//   menuItem: {
//     backgroundColor: "hsl(var(--modal-background))",
//     borderBottomWidth: 1,
//     overflow: "hidden", // Ensures the ripple effect respects border radius
//   },
//   button: {
//     borderRadius: 0,
//     margin: 0,
//     backgroundColor: "transparent",
//   },
//   buttonContent: {
//     // paddingHorizontal: 5,
//     // paddingVertical: 5,
//     minHeight: 50,
//     justifyContent: "flex-start",
//     alignItems: "center",
//   },
//   menuItemContent: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     paddingHorizontal: 10,
//   },
//   menuItemLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     minWidth: 0, // Important: allows flex child to shrink below its content size
//     marginRight: 5, // Space between left content and right content
//   },
//   menuItemRight: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexShrink: 0, // Prevent right side from shrinking
//     marginRight: -10,
//     marginLeft: 10,
//   },
//   rightActionWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   textContainer: {
//     flex: 1,
//     minWidth: 0, // Important: allows text to shrink and be truncated
//   },
//   icon: {
//     marginRight: 12,
//   },
//   menuItemTitle: {
//     fontSize: 14,
//   },
//   menuItemSubtitle: {
//     fontSize: 12,
//     marginTop: 4,
//     color: "#AAAAAA",
//   },
//   menuItemValue: {
//     color: "#666666",
//     fontSize: 14,
//     marginRight: 8,
//     maxWidth: 150, // Limit value text width
//   },
//   iconContainer: {
//     width: 32,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "flex-start",
//     flexShrink: 0, // Prevent icon from shrinking
//   },
//   loadingIndicator: {
//     marginRight: 8,
//   },
// });

// export default MenuItem;

// Fallback for Pressable

import { useTheme } from "@contexts/ThemeContext";
import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ViewStyle,
  StyleProp,
  Platform,
  Animated,
} from "react-native";
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
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  showValue?: boolean;
  showChevron?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  rightAction?: React.ReactNode;
  rightActionContainerStyle?: StyleProp<ViewStyle>;
  disableRipple?: boolean;
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
  onPressIn,
  onPressOut,
  disabled,
  showValue = true,
  showChevron = true,
  loading = false,
  style,
  containerStyle,
  rightAction,
  rightActionContainerStyle,
  disableRipple = false,
}) => {
  const { isDark } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const backgroundColor = isDark ? "#1E1E1E" : "#ffffff";
  const dimBackgroundColor = isDark ? "#2A2A2A" : "rgb(241, 241, 241)";
  const dangerDimBackgroundColor = isDark ? "#2A1F1F" : "#FFE8E8";
  const borderBottomColor = isDark ? "#404040" : "rgb(210, 210, 210)";
  const normalTextColor = isDark ? "#ffffff" : "#171717";
  const dangerTextColor = isDark ? "#FF4545" : "#FF4545";
  const valueTextColor = isDark ? "#666666" : "rgb(142, 142, 142)";
  const chevronColor = isDark ? "#666666" : "rgb(142, 142, 142)";

  const computedContainerStyle = {
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

  const handlePressIn = () => {
    if (Platform.OS === "ios") {
      setIsPressed(true);
      fadeAnim.setValue(1);
    }
    onPressIn?.();
  };

  const handlePressOut = () => {
    if (Platform.OS === "ios") {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start(() => {
        setIsPressed(false);
      });
    }
    onPressOut?.();
  };

  return (
    <View style={[computedContainerStyle, containerStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading || disabled}
        style={[styles.pressable, style]}
        android_ripple={
          disableRipple
            ? undefined
            : {
                color: rippleColor,
                borderless: false,
              }
        }
      >
        {Platform.OS === "ios" && isPressed && (
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              opacity: fadeAnim,
            }}
            pointerEvents="none"
          />
        )}
        <View style={[styles.menuItemContent, style]}>
          <View style={styles.menuItemLeft}>
            {icon && (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={(icon as any) || ""}
                  size={20}
                  color={textColor}
                  style={styles.icon}
                />
              </View>
            )}
            <View style={styles.textContainer}>
              <Text
                style={[styles.menuItemTitle, { color: textColor }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
              {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
            </View>
          </View>
          {rightAction ? (
            <View
              style={[styles.menuItemRight, rightActionContainerStyle]}
              pointerEvents="box-none"
            >
              <View style={styles.rightActionWrapper} pointerEvents="box-only">
                {rightAction}
              </View>
            </View>
          ) : (
            <View style={styles.menuItemRight} pointerEvents="none">
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
                <Loader style={{ marginRight: 5 }} color={chevronColor} size={15} />
              ) : showChevron ? (
                <Ionicons name="chevron-forward" size={20} color={chevronColor} />
              ) : null}
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    backgroundColor: "hsl(var(--modal-background))",
    borderBottomWidth: 1,
    overflow: "hidden",
  },
  pressable: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    minHeight: 50,
    position: "relative",
  },
  menuItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    marginRight: 5,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    marginRight: -10,
    marginLeft: 10,
  },
  rightActionWrapper: {
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
    maxWidth: 150,
  },
  iconContainer: {
    width: 32,
    height: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  button: {
    borderRadius: 0,
    margin: 0,
    backgroundColor: "transparent",
  },
  buttonContent: {
    minHeight: 50,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  loadingIndicator: {
    marginRight: 8,
  },
});

export default MenuItem;