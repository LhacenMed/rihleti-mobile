import { Text, View, Alert, Platform } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import SafeContainer from "@/components/SafeContainer";
import { Button } from "react-native-paper";

export default function Account({ navigation }: { navigation: any }) {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <SafeContainer>
      <View className="flex-1 px-8">
        <Text
          style={{
            paddingTop: Platform.OS === "ios" ? 20 : 0,
          }}
          className="mb-8 text-center font-outfit-bold text-4xl text-foreground"
        >
          Account
        </Text>
        <Text className="font-outfit-medium mb-8 text-center text-xl text-muted-foreground">
          Manage your account settings
        </Text>

        <View className="mb-10 rounded-sm border border-border bg-card p-5">
          <Text className="font-outfit-medium mb-3 text-xl text-muted-foreground">
            Email: {user?.email || "Not available"}
          </Text>
          <Text className="font-outfit-medium mb-3 text-xl text-muted-foreground">
            User ID: {user?.id || "Not available"}
          </Text>
          <Text className="font-outfit-medium mb-3 text-xl text-muted-foreground">
            Member since:{" "}
            {user?.created_at ? new Date(user.created_at).getFullYear() : "Not available"}
          </Text>
          <Text className="font-outfit-medium mb-3 text-xl text-muted-foreground">
            Email verified: {user?.email_confirmed_at ? "Yes" : "No"}
          </Text>
        </View>

        <View className="mt-5">
          <Button mode="outlined" onPress={() => navigation.goBack()} textColor="#606c38">
            Back to Settings
          </Button>
        </View>

        <View className="mt-5">
          <Button mode="outlined" onPress={handleSignOut} textColor="#dc3545">
            Sign Out
          </Button>
        </View>
      </View>
    </SafeContainer>
  );
}
