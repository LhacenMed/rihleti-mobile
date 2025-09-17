import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SafeContainer from "@/components/SafeContainer";
// import DropdownMenu from "@/components/blocks/dropdown-menu";
import { BlurView } from "expo-blur";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Messages = () => {
  const navigation = useNavigation();

  // Animated values for BlurView position
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

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
      time: "Aug 20",
      unread: true,
    },
    {
      id: "4",
      name: "Emily Davis",
      message: "Looking forward to our appointment",
      time: "Aug 15",
      unread: false,
    },
  ];

  const items = [
    { key: "new", title: "New", icon: "plus", iconAndroid: "logo-google" },
    { key: "all", title: "All", icon: "list", iconAndroid: "list" },
    { key: "starred", title: "Starred", icon: "star", iconAndroid: "star" },
  ];

  // Gesture handler for pan gestures
  const pan = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1.05); // Slightly scale up when dragging starts
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      scale.value = withSpring(1); // Scale back to normal when dragging ends

      // Optional: Add boundary constraints or snap back to center
      // You can uncomment and modify these lines to add boundaries
      /*
      const maxX = 100; // Adjust based on your screen width
      const maxY = 200; // Adjust based on your screen height
      
      if (Math.abs(translateX.value) > maxX) {
        translateX.value = withSpring(translateX.value > 0 ? maxX : -maxX);
      }
      if (Math.abs(translateY.value) > maxY) {
        translateY.value = withSpring(translateY.value > 0 ? maxY : -maxY);
      }
      */
    });

  // Animated style for the BlurView
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

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

          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "box-none",
            }}
          >
            <GestureDetector gesture={pan}>
              <AnimatedBlurView
                experimentalBlurMethod="dimezisBlurView"
                intensity={50}
                blurReductionFactor={6}
                style={[
                  {
                    width: "85%",
                    minHeight: 140,
                    borderRadius: 20,
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    // Add some visual feedback
                    // shadowColor: "#000",
                    // shadowOpacity: 0.15,
                    // shadowRadius: 12,
                    // shadowOffset: { width: 0, height: 8 },
                    // elevation: 8,
                    // backgroundColor: "rgba(255,255,255,0.08)",
                  },
                  animatedStyle,
                ]}
              >
                <View style={{ alignItems: "center", justifyContent: "center", padding: 16 }}>
                  <Text className="text-lg font-medium text-foreground">Hello world!</Text>
                  <Text className="mt-2 text-sm text-muted-foreground">Drag me around!</Text>
                </View>
              </AnimatedBlurView>
            </GestureDetector>
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
