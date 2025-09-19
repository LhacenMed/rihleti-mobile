import "react-native-gesture-handler";
import "../../global.css";
import "@/utils/haptic";

import { withLayoutContext } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PaperProvider } from "react-native-paper";
import { ModalPresenterParent } from "@whitespectre/rn-modal-presenter";

import { toastConfig } from "@/components/ui/toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { StreamChatProvider } from "@/contexts/StreamChatContext";
import { FeaturesProvider } from "@/contexts/FeaturesContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

const { Navigator } = createStackNavigator();
const RootStack = withLayoutContext(Navigator);

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <FeaturesProvider>
            <AuthProvider>
              <StreamChatProvider>
              <PaperProvider>
                <ModalPresenterParent>
                  <BottomSheetModalProvider>
                    <StatusBar style="auto" translucent />
                    <RootStack
                      screenOptions={{
                        headerShown: false,
                        ...TransitionPresets.SlideFromRightIOS,
                        gestureEnabled: true,
                      }}
                    >
                      <RootStack.Screen name="index" />
                      <RootStack.Screen name="(auth)" />
                      <RootStack.Screen name="(app)" />
                      <RootStack.Screen
                        name="settings-test"
                        options={{
                          presentation: "modal",
                          headerShown: false,
                        }}
                      />
                      <RootStack.Screen
                        name="recording"
                        options={{
                          headerShown: false,
                        }}
                      />
                      <RootStack.Screen
                        name="webview"
                        options={{
                          presentation: "modal",
                          headerShown: false,
                          ...TransitionPresets.ModalPresentationIOS,
                        }}
                      />
                    </RootStack>
                    <Toast
                      config={toastConfig}
                      position="top"
                      topOffset={60}
                      visibilityTime={4000}
                      autoHide={true}
                      swipeable={true}
                    />
                  </BottomSheetModalProvider>
                </ModalPresenterParent>
              </PaperProvider>
              </StreamChatProvider>
            </AuthProvider>
          </FeaturesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
