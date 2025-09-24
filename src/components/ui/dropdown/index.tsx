import { Root } from "./Root";
import { Trigger } from "./Trigger";
import { Content } from "./Content";
import { Item } from "./Item";

export const DropdownMenu = {
  Root,
  Trigger,
  Content,
  Item,
};

// Also export individual components for flexibility
export { Root, Trigger, Content, Item };
export { useDropdown } from "./Root";
