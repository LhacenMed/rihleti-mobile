import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowTopRightOnSquareIcon } from "react-native-heroicons/mini";
import SafeContainer from "@/components/SafeContainer";

interface RouteParams {
  link: string;
  title?: string;
}

export default function WebViewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { link, title = "Web Content" } = route.params as RouteParams;

  // State for tracking loading progress
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(link);
  const [displayUrl, setDisplayUrl] = useState("");
  const [isUrlEditing, setIsUrlEditing] = useState(false);
  const [editableUrl, setEditableUrl] = useState(link);
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const webViewRef = useRef(null);
  const { isDark } = useTheme();

  // Extract domain from URL
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  // Update display URL when current URL changes
  useEffect(() => {
    setDisplayUrl(getDomain(currentUrl));
  }, [currentUrl]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOpenInBrowser = async () => {
    try {
      // Ensure URL has protocol
      const urlToOpen = currentUrl.startsWith("http") ? currentUrl : `https://${currentUrl}`;
      await Linking.openURL(urlToOpen);
    } catch (error) {
      Alert.alert("Unable to open link", "Please try again later.");
    }
  };

  const handleLoadProgress = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    const progress = nativeEvent.progress;

    Animated.timing(progressAnim, {
      toValue: progress * screenWidth,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handleNavigationStateChange = (navState: any) => {
    setCurrentUrl(navState.url);
    if (typeof navState.url === "string") {
      if (navState.url === link) {
        setPageTitle(null);
      } else if (navState.title && typeof navState.title === "string") {
        setPageTitle(navState.title);
      }
    }
  };

  const handleUrlPress = () => {
    setIsUrlEditing(true);
    setEditableUrl(currentUrl);
  };

  const handleUrlSubmit = () => {
    let url = editableUrl.trim();

    // Add protocol if missing
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      new URL(url); // Validate URL
      setCurrentUrl(url);
      setEditableUrl(url);
      setIsUrlEditing(false);

      // Navigate to new URL
      if (webViewRef.current) {
        (webViewRef.current as any).injectJavaScript(`window.location.href = "${url}";`);
      }
    } catch {
      Alert.alert("Invalid URL", "Please enter a valid URL");
    }
  };

  const handleUrlCancel = () => {
    setIsUrlEditing(false);
    setEditableUrl(currentUrl);
  };

  const handleLoadEnd = () => {
    // Complete the progress bar first
    Animated.timing(progressAnim, {
      toValue: screenWidth,
      duration: 100,
      useNativeDriver: false,
    }).start(() => {
      // Hide the loading bar after a short delay
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    });
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    progressAnim.setValue(0);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-border bg-background px-4 py-3">
        {/* Top row with back button and title */}
        <View className="mb-3 flex-row items-center">
          <View className="w-16 items-start">
            <TouchableOpacity onPress={handleGoBack}>
              <Ionicons
                size={20}
                name="arrow-back"
                color={isDark ? "white" : "black"}
                className="-ml-1"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-center text-base font-semibold text-foreground">
              {pageTitle || title}
            </Text>
          </View>
          <View className="w-16 items-end">
            <TouchableOpacity onPress={handleOpenInBrowser}>
              {/* <Ionicons size={20} name="open-outline" color={isDark ? "white" : "black"} /> */}
              <ArrowTopRightOnSquareIcon size={20} color={isDark ? "white" : "black"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* URL Bar */}
        <View className="flex-row items-center">
          <View className="flex-1 rounded-full bg-secondary px-4 py-2">
            {isUrlEditing ? (
              <View className="flex-row items-center">
                <TextInput
                  value={editableUrl}
                  onChangeText={setEditableUrl}
                  onSubmitEditing={handleUrlSubmit}
                  onBlur={handleUrlCancel}
                  autoFocus
                  selectTextOnFocus
                  className="flex-1 p-0 text-sm text-muted-foreground"
                  placeholder="Enter URL..."
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={handleUrlSubmit} className="ml-2">
                  <Text className="font-medium text-blue-500">Go</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={handleUrlPress} className="flex-row items-center">
                <Ionicons
                  name="lock-closed"
                  size={13}
                  color={isDark ? "#fff" : "#000"}
                  className="mr-2"
                />
                <Text className="flex-1 text-sm text-muted-foreground" numberOfLines={1}>
                  {displayUrl}
                </Text>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={13}
                  color={isDark ? "#fff" : "#000"}
                  className="ml-2"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* WebView */}
      <View className="relative flex-1">
        {/* Progress Bar - Absolute positioned over WebView */}
        {isLoading && (
          <View className="absolute left-0 right-0 top-0 z-10 h-1 overflow-hidden bg-gray-200">
            <Animated.View
              className="h-full bg-blue-500"
              style={{
                width: progressAnim,
                backgroundColor: "#3B82F6", // blue-500 color
              }}
            />
          </View>
        )}

        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={{ flex: 1 }}
          // startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsBackForwardNavigationGestures={true}
          onLoadStart={handleLoadStart}
          onLoadProgress={handleLoadProgress}
          onLoadEnd={handleLoadEnd}
          onNavigationStateChange={handleNavigationStateChange}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
            setIsLoading(false);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView HTTP error: ", nativeEvent);
            setIsLoading(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
