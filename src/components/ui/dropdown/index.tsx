import { Root } from "./Root";
import { Trigger } from "./Trigger";
import { Content } from "./Content";
import { Item } from "./Item";
import { Group } from "./Group";

export const DropdownMenu = {
  Root,
  Trigger,
  Content,
  Item,
  Group,
};

// Also export individual components for flexibility
export { Root, Trigger, Content, Item, Group };
export { useDropdown } from "./Root";
