import React, { useRef, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

interface Props {
  navigation: any;
}

const WelcomeScreen = ({ navigation }: Props) => {
  // BottomSheet ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Callbacks - addressing missing handlers from roadmap
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleDismiss = useCallback(() => {
    console.log("Bottom sheet dismissed");
  }, []);

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        enableTouchThrough={false}
      />
    ),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Rihleti</Text>
        <Text style={styles.subtitle}>Your travel companion app</Text>

        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✈️</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Bottom Sheet Trigger Button */}
          <TouchableOpacity style={styles.infoButton} onPress={handlePresentModalPress}>
            <Text style={styles.infoButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet Modal */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        onDismiss={handleDismiss}
        enableDismissOnClose={true}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.modalTitle}>About Rihleti ✈️</Text>
          <Text style={styles.modalText}>
            Rihleti is your ultimate travel companion, designed to make your journeys seamless and
            memorable.
          </Text>
          <Text style={styles.modalText}>
            • Plan your trips with ease{"\n"}• Discover hidden gems{"\n"}• Connect with fellow
            travelers{"\n"}• Track your adventures
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              bottomSheetModalRef.current?.dismiss();
              navigation.navigate("SignUp");
            }}
          >
            <Text style={styles.modalButtonText}>Get Started</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefae0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 60,
  },
  iconContainer: {
    marginBottom: 60,
  },
  icon: {
    fontSize: 80,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#606c38",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#606c38",
  },
  secondaryButtonText: {
    color: "#606c38",
    fontSize: 18,
    fontWeight: "600",
  },
  infoButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  infoButtonText: {
    color: "#606c38",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  // Bottom Sheet Modal Styles
  contentContainer: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "#666",
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: "#606c38",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WelcomeScreen;
