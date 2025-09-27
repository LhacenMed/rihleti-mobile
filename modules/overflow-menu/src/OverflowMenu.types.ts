// modules/overflow-menu/src/OverflowMenu.types.ts
import type { ReactNode } from "react";
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
  // Android-only: drawable resource name to be used as menu item icon (e.g., "ic_edit").
  icon?: string;
};

export type OverflowMenuSelectEvent = {
  id?: string;
  index: number;
  title: string;
};

export type OverflowMenuTriggerRenderProps = {
  openMenu: () => void;
};

export type OverflowMenuViewProps = {
  items: OverflowMenuItem[];
  onItemSelected?: (event: { nativeEvent: OverflowMenuSelectEvent }) => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  // If provided, this render prop will be rendered inside the native view and receives an `openMenu` callback.
  renderTrigger?: (props: OverflowMenuTriggerRenderProps) => ReactNode;
};
