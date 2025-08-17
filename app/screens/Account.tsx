import { ScrollView, StyleSheet, Text, View, Button } from "react-native";
import React from "react";

export default function Account({ navigation }: { navigation: any }) {
  return (
    <ScrollView style={{ backgroundColor: "#fefae0" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Manage your account settings</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Email: user@example.com</Text>
          <Text style={styles.infoText}>Username: Lhacen Med</Text>
          <Text style={styles.infoText}>Member since: 2024</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Back to Settings"
            onPress={() => navigation.goBack()}
            color="#606c38"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
