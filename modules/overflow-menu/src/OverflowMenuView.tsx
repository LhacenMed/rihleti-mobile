// modules/overflow-menu/src/OverflowMenuView.tsx
import { requireNativeView } from "expo";
import * as React from "react";

import { OverflowMenuViewProps } from "./OverflowMenu.types";

// Native view props should not include JS-only props like `renderTrigger`.
// We also allow children to be passed through to the native container.
const NativeView: any = requireNativeView("OverflowMenu");

const OverflowMenuView = React.forwardRef<any, OverflowMenuViewProps>((props, ref) => {
  const { renderTrigger, children, ...nativeProps } = props as any;
  const innerRef = React.useRef<any>(null);
  const [openRequestId, setOpenRequestId] = React.useState<number | null>(null);

  const openMenu = React.useCallback(() => {
    // Bump the request id to trigger native open via prop change
    setOpenRequestId((v) => (v === null ? 1 : v + 1));
  }, []);

  React.useImperativeHandle(ref, () => ({
    show: openMenu,
  }));

  if (typeof renderTrigger === "function") {
    return (
      <NativeView ref={innerRef} {...nativeProps} openRequestId={openRequestId ?? undefined}>
        {renderTrigger({ openMenu })}
      </NativeView>
    );
  }

  return (
    <NativeView ref={innerRef} {...nativeProps} openRequestId={openRequestId ?? undefined}>
      {children}
    </NativeView>
  );
});

export default OverflowMenuView;
