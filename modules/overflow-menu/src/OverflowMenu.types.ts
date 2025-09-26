// modules/overflow-menu/src/OverflowMenu.types.ts
import type { StyleProp, ViewStyle } from "react-native";

export type ChangeEventPayload = {
  value: string;
};

export type OverflowMenuModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type OverflowMenuItem = {
  id?: string;
  title: string;
  enabled?: boolean;
};

export type OverflowMenuSelectEvent = {
  id?: string;
  index: number;
  title: string;
};

export type OverflowMenuViewProps = {
  items: OverflowMenuItem[];
  onItemSelected?: (event: { nativeEvent: OverflowMenuSelectEvent }) => void;
  style?: StyleProp<ViewStyle>;
};
