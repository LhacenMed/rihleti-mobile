import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SafeContainer from "@/components/SafeContainer";
// import DropdownMenu from "@/components/blocks/dropdown-menu";

const Messages = () => {
  const navigation = useNavigation();

  // Sample messages data
  const messages = [
    {
      id: "1",
      name: "John Doe",
      message: "Hey, are we still on for tomorrow?",
      time: "10:30 AM",
      unread: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      message: "Thanks for the booking confirmation!",
      time: "Yesterday",
      unread: false,
    },
    {
      id: "3",
      name: "Robert Johnson",
      message: "Can we reschedule our meeting?",
      time: "Yesterday",
      unread: true,
    },
    {
      id: "4",
      name: "Emily Davis",
      message: "Looking forward to our appointment",
      time: "Aug 20",
      unread: false,
    },
  ];

  const items = [
    { key: "new", title: "New", icon: "plus", iconAndroid: "logo-google" },
    { key: "all", title: "All", icon: "list", iconAndroid: "list" },
    { key: "starred", title: "Starred", icon: "star", iconAndroid: "star" },
  ];

  return (
    <SafeContainer
      header={{
        title: "Messages",
        showBackButton: true,
        // rightComponent: <DropdownMenu items={items} onSelect={() => {}} />,
        onBackPress: () => navigation.goBack(),
      }}
    >
      <ScrollView>
        <View className="p-4">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground">Messages</Text>
            <Text className="text-muted-foreground">You have 2 unread messages</Text>
          </View>

          {messages.map((message) => (
            <TouchableOpacity
              key={message.id}
              className="mb-4 flex-row items-center rounded-lg border border-border bg-card p-4"
              onPress={() => {
                // Navigate to chat screen (would be implemented later)
              }}
            >
              <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Text className="text-lg font-bold text-primary-foreground">
                  {message.name.charAt(0)}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between">
                  <Text className="font-semibold text-foreground">{message.name}</Text>
                  <Text className="text-sm text-muted-foreground">{message.time}</Text>
                </View>
                <Text
                  className={`text-sm ${message.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  numberOfLines={1}
                >
                  {message.message}
                </Text>
              </View>
              {message.unread && <View className="ml-2 h-3 w-3 rounded-full bg-primary" />}
            </TouchableOpacity>
          ))}

          {messages.length === 0 && (
            <View className="items-center justify-center py-12">
              <Ionicons name="chatbubbles-outline" size={48} color="#94a3b8" />
              <Text className="mt-4 text-center text-muted-foreground">
                No messages yet. Your conversations will appear here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeContainer>
  );
};

export default Messages;