import { requireNativeView } from "expo";
import * as React from "react";

import { OverflowMenuViewProps } from "./OverflowMenu.types";

const NativeView: React.ComponentType<OverflowMenuViewProps> = requireNativeView("OverflowMenu");

export default function OverflowMenuView(props: OverflowMenuViewProps) {
  return <NativeView {...props} />;
}
