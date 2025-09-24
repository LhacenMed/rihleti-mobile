import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DropdownMenu } from "./index";

// Helpers
const makeIcon = (name: any) => (color: string) => (
  <Ionicons name={name} size={20} color={color} />
);

export const DropdownMenuExample = () => {
  const handleSelect = (key: string) => console.log("Selected:", key);

  return (
    <View className="flex-1 gap-8 p-4">
      <Text className="text-lg font-bold">Dropdown Menu Examples</Text>

      {/* Basic */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <View className="rounded bg-primary px-3 py-2">
            <Ionicons name="ellipsis-vertical" size={20} color="white" />
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" maxHeight={250}>
          <DropdownMenu.Item title="Mute" icon={makeIcon("volume-mute-outline")} onSelect={() => handleSelect("mute")} />
          <DropdownMenu.Item title="Video Call" icon={makeIcon("videocam-outline")} onSelect={() => handleSelect("video")} />
          <DropdownMenu.Item title="Search" icon={makeIcon("search-outline")} onSelect={() => handleSelect("search")} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Grouped + destructive + disabled */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <View className="rounded bg-blue-500 px-4 py-2">
            <Text className="text-white">Grouped</Text>
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" maxHeight={250}>
          <DropdownMenu.Group first>
            <DropdownMenu.Item title="Change Wallpaper" icon={makeIcon("image-outline")} onSelect={() => handleSelect("wallpaper")} />
            <DropdownMenu.Item title="Search" icon={makeIcon("search-outline")} onSelect={() => handleSelect("search")} />
          </DropdownMenu.Group>
          <DropdownMenu.Group>
            <DropdownMenu.Item title="Clear History" icon={makeIcon("brush-outline")} onSelect={() => handleSelect("clear")}  />
            <DropdownMenu.Item title="Delete chat" icon={makeIcon("trash-outline")} onSelect={() => handleSelect("delete")} destructive />
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Long list (scrolls when exceeding maxHeight) */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <View className="rounded bg-emerald-500 px-4 py-2">
            <Text className="text-white">Many Items</Text>
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" maxHeight={250}>
          {Array.from({ length: 20 }).map((_, i) => (
            <DropdownMenu.Item
              key={`item-${i}`}
              title={`Item ${i + 1}`}
              icon={makeIcon("document-text-outline")}
              onSelect={() => handleSelect(`item-${i + 1}`)}
            />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Controlled state + asChild trigger */}
      <ControlledDropdownExample />
    </View>
  );
};

const ControlledDropdownExample = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <View className="gap-2">
      <Text className="text-sm text-gray-600">Controlled dropdown (open: {open ? "yes" : "no"})</Text>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <View className="rounded bg-gray-200 px-4 py-2">
            <Text>Open Menu</Text>
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" maxHeight={250}>
          <DropdownMenu.Item title="Profile" icon={makeIcon("person-outline")} onSelect={() => console.log("Profile")} />
          <DropdownMenu.Item title="Settings" icon={makeIcon("settings-outline")} onSelect={() => console.log("Settings")} />
          <DropdownMenu.Item title="Close" icon={makeIcon("close-outline")} onSelect={() => setOpen(false)} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </View>
  );
};

export default DropdownMenuExample;
