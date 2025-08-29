import Toast from "react-native-toast-message";

// Toast message types
export type ToastType = "success" | "error" | "info" | "warning";

// Toast position types
export type ToastPosition = "top" | "bottom";

// Common toast configurations
export const toastConfigs = {
  short: { visibilityTime: 2000, position: "top" as ToastPosition },
  medium: { visibilityTime: 4000, position: "top" as ToastPosition },
  long: { visibilityTime: 6000, position: "top" as ToastPosition },
};

// Success toast messages
export const showSuccessToast = (
  title: string,
  message?: string,
  config?: Partial<typeof toastConfigs.short>
) => {
  Toast.show({
    type: "success",
    text1: title,
    text2: message,
    ...toastConfigs.short,
    ...config,
  });
};

// Error toast messages
export const showErrorToast = (
  title: string,
  message?: string,
  config?: Partial<typeof toastConfigs.medium>
) => {
  Toast.show({
    type: "error",
    text1: title,
    text2: message,
    ...toastConfigs.medium,
    ...config,
  });
};

// Info toast messages
export const showInfoToast = (
  title: string,
  message?: string,
  config?: Partial<typeof toastConfigs.short>
) => {
  Toast.show({
    type: "info",
    text1: title,
    text2: message,
    ...toastConfigs.short,
    ...config,
  });
};

// Warning toast messages
export const showWarningToast = (
  title: string,
  message?: string,
  config?: Partial<typeof toastConfigs.medium>
) => {
  Toast.show({
    type: "warning",
    text1: title,
    text2: message,
    ...toastConfigs.medium,
    ...config,
  });
};

// Primary toast messages (using app's orange color)
export const showPrimaryToast = (
  title: string,
  message?: string,
  config?: Partial<typeof toastConfigs.short>
) => {
  Toast.show({
    type: "primary",
    text1: title,
    text2: message,
    ...toastConfigs.short,
    ...config,
  });
};

// Location-specific toast messages
export const showLocationErrorToast = () => {
  showErrorToast(
    "Missing Location Information",
    "Please select both departure and destination locations"
  );
};

export const showLocationSuccessToast = (departure: string, destination: string) => {
  showSuccessToast(
    "Locations Selected",
    `${departure} → ${destination}`
  );
};

export const showSearchToast = (departure: string, destination: string) => {
  showSuccessToast(
    "Searching for Trips",
    `${departure} → ${destination}`,
    { visibilityTime: 1500 }
  );
};

// Generic toast messages
export const showNetworkErrorToast = () => {
  showErrorToast(
    "Network Error",
    "Please check your internet connection and try again"
  );
};

export const showLoadingToast = (message: string) => {
  showInfoToast("Loading", message, { visibilityTime: 1000 });
};

export const showGenericErrorToast = (message?: string) => {
  showErrorToast(
    "Something went wrong",
    message || "Please try again later"
  );
};
