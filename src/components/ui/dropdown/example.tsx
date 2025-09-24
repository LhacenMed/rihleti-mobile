import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DropdownMenu } from "./index";

// Example usage of the DropdownMenu component
export const DropdownMenuExample = () => {
  const menuItems = [
    { key: "edit", title: "Edit" },
    { key: "duplicate", title: "Duplicate" },
    { key: "share", title: "Share" },
    { key: "delete", title: "Delete", destructive: true },
  ];

  const handleSelect = (key: string) => {
    console.log("Selected:", key);
    // Handle the selection here
  };

  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-lg font-bold">Dropdown Menu Example</Text>

      {/* Basic usage */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <View className="rounded bg-primary p-2">
            <Ionicons name="ellipsis-vertical" size={20} color="white" />
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          {menuItems.map((item) => (
            <DropdownMenu.Item
              key={item.key}
              onSelect={() => handleSelect(item.key)}
              destructive={item.destructive}
            >
              {item.title}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* With custom alignment */}
      <View className="mt-8">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <View className="rounded bg-blue-500 px-4 py-2">
              <Text className="text-white">Options Menu</Text>
            </View>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Item onSelect={() => console.log("Profile")}>
              View Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => console.log("Settings")}>Settings</DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => console.log("Help")}>
              Help & Support
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => console.log("Logout")} destructive>
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>

      {/* Controlled state example */}
      <ControlledDropdownExample />
    </View>
  );
};

// Example with controlled state
const ControlledDropdownExample = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <View className="mt-8">
      <Text className="mb-2 text-sm text-gray-600">
        Controlled dropdown (open: {open ? "yes" : "no"})
      </Text>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger>
          <View className="rounded bg-gray-200 px-4 py-2">
            <Text>Controlled Menu</Text>
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={() => console.log("Action 1")}>Action 1</DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => console.log("Action 2")}>Action 2</DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => {
              console.log("Close menu");
              setOpen(false);
            }}
          >
            Close Menu
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </View>
  );
};

export default DropdownMenuExample;
