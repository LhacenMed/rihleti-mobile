import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
export type DropdownMenuProps = {
  items: Array<{ key: string; title: string; icon: string; iconAndroid: string }>;
  onSelect: (key: string) => void;
};
const DropDownMenu = ({ items, onSelect }: DropdownMenuProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Ionicons name="ellipsis-vertical" size={20} color="white" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            {item.title}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
export default DropDownMenu;
