import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { BaseToast, ErrorToast, SuccessToast, InfoToast } from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

// Dynamic styles based on theme
const getDynamicStyles = (isDark: boolean) => ({
  errorToast: {
    backgroundColor: isDark ? "#1F1F1F" : "#FEF2F2",
    borderLeftColor: "#EF4444",
  },
  successToast: {
    backgroundColor: isDark ? "#1F1F1F" : "#F0FDF4",
    borderLeftColor: "#10B981",
  },
  infoToast: {
    backgroundColor: isDark ? "#1F1F1F" : "#EFF6FF",
    borderLeftColor: "#3B82F6",
  },
  warningToast: {
    backgroundColor: isDark ? "#1F1F1F" : "#FFFBEB",
    borderLeftColor: "#F59E0B",
  },
  errorText1: {
    color: isDark ? "#FCA5A5" : "#991B1B",
  },
  errorText2: {
    color: isDark ? "#FECACA" : "#7F1D1D",
  },
  successText1: {
    color: isDark ? "#86EFAC" : "#065F46",
  },
  successText2: {
    color: isDark ? "#BBF7D0" : "#064E3B",
  },
  infoText1: {
    color: isDark ? "#93C5FD" : "#1E40AF",
  },
  infoText2: {
    color: isDark ? "#BFDBFE" : "#1E3A8A",
  },
  warningText1: {
    color: isDark ? "#FCD34D" : "#92400E",
  },
  warningText2: {
    color: isDark ? "#FDE68A" : "#78350F",
  },
  primaryToast: {
    backgroundColor: isDark ? "#1F1F1F" : "#FFF7ED",
    borderLeftColor: "#FF5A1F",
  },
  primaryText1: {
    color: isDark ? "#FED7AA" : "#9A3412",
  },
  primaryText2: {
    color: isDark ? "#FEF3C7" : "#7C2D12",
  },
});

// Custom Error Toast
export const CustomErrorToast = (props: any) => {
  const { isDark } = useTheme();
  const dynamicStyles = getDynamicStyles(isDark);
  
  return (
    <ErrorToast
      {...props}
      style={[styles.errorToast, dynamicStyles.errorToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={[styles.errorText1, dynamicStyles.errorText1]}
      text2Style={[styles.errorText2, dynamicStyles.errorText2]}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle" size={24} color="#EF4444" />
        </View>
      )}
    />
  );
};

// Custom Success Toast
export const CustomSuccessToast = (props: any) => {
  const { isDark } = useTheme();
  const dynamicStyles = getDynamicStyles(isDark);
  
  return (
    <SuccessToast
      {...props}
      style={[styles.successToast, dynamicStyles.successToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={[styles.successText1, dynamicStyles.successText1]}
      text2Style={[styles.successText2, dynamicStyles.successText2]}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        </View>
      )}
    />
  );
};

// Custom Info Toast
export const CustomInfoToast = (props: any) => {
  const { isDark } = useTheme();
  const dynamicStyles = getDynamicStyles(isDark);
  
  return (
    <InfoToast
      {...props}
      style={[styles.infoToast, dynamicStyles.infoToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={[styles.infoText1, dynamicStyles.infoText1]}
      text2Style={[styles.infoText2, dynamicStyles.infoText2]}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
        </View>
      )}
    />
  );
};

// Custom Warning Toast
export const CustomWarningToast = (props: any) => {
  const { isDark } = useTheme();
  const dynamicStyles = getDynamicStyles(isDark);
  
  return (
    <BaseToast
      {...props}
      style={[styles.warningToast, dynamicStyles.warningToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={[styles.warningText1, dynamicStyles.warningText1]}
      text2Style={[styles.warningText2, dynamicStyles.warningText2]}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={24} color="#F59E0B" />
        </View>
      )}
    />
  );
};

// Custom Primary Toast (using app's orange color)
export const CustomPrimaryToast = (props: any) => {
  const { isDark } = useTheme();
  const dynamicStyles = getDynamicStyles(isDark);
  
  return (
    <BaseToast
      {...props}
      style={[styles.primaryToast, dynamicStyles.primaryToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={[styles.primaryText1, dynamicStyles.primaryText1]}
      text2Style={[styles.primaryText2, dynamicStyles.primaryText2]}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Ionicons name="car" size={24} color="#FF5A1F" />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  errorToast: {
    borderLeftWidth: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successToast: {
    borderLeftWidth: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoToast: {
    borderLeftWidth: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  warningToast: {
    borderLeftWidth: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText1: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  errorText2: {
    fontSize: 14,
  },
  successText1: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  successText2: {
    fontSize: 14,
  },
  infoText1: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoText2: {
    fontSize: 14,
  },
  warningText1: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  warningText2: {
    fontSize: 14,
  },
  primaryToast: {
    borderLeftWidth: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryText1: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  primaryText2: {
    fontSize: 14,
  },
});

// Toast configuration object
export const toastConfig = {
  success: CustomSuccessToast,
  error: CustomErrorToast,
  info: CustomInfoToast,
  warning: CustomWarningToast,
  primary: CustomPrimaryToast,
};
