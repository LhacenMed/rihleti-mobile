import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { Pressable, findNodeHandle, ViewStyle } from "react-native";
import { CascadePopupMenuView, showMenu } from "@modules/cascade-popup-menu";
import type {
  OnItemSelectedEvent,
  MenuSpec,
  PopupStyle,
} from "@modules/cascade-popup-menu/src/CascadePopupMenu.types";
import {
  addOnItemSelectedListener,
  addOnDismissListener,
  type ListenerSubscription,
} from "@modules/cascade-popup-menu/src/CascadePopupMenuModule";

export type PopupMenuHandle = { show: () => void };

// Public, simple types so consumers don't need to import module types
export type PopupMenuIcon = { resource?: string; base64?: string };
export type PopupMenuItem = {
  id?: string;
  title: string;
  icon?: PopupMenuIcon;
  enabled?: boolean;
  useCustomRow?: boolean;
  items?: PopupMenuItem[];
  onSelect?: (info: { id?: string; title: string; path: string[] }) => void;
};
export type PopupMenuStyle = {
  textSizeSp?: number;
  itemPaddingHorizontalDp?: number;
  itemHeightDp?: number;
  backgroundColor?: string;
  elevationDp?: number;
  submenuArrowResource?: string;
  forceCustomRow?: boolean;
};

export type PopupMenuProps = {
  items: PopupMenuItem[];
  header?: string;
  style?: PopupMenuStyle;
  onSelect?: (info: { id?: string; title: string; path: string[] }) => void;
  onDismiss?: () => void;
  trigger?: "press" | "longPress" | "none";
  useNativeView?: boolean;
  anchorTag?: number | null;
  wrapperStyle?: ViewStyle;
  children?: React.ReactNode;
  disabled?: boolean;
};

// Internal helpers
type HandlerMap = Map<string, (info: { id?: string; title: string; path: string[] }) => void>;
const idKey = (id: string) => `id:${id}`;
const pathKey = (path: string[]) => `path:${path.join(">")}`;

function toMenuSpec(
  items: PopupMenuItem[],
  header?: string
): { menu: MenuSpec; handlers: HandlerMap } {
  const handlers: HandlerMap = new Map();

  function walk(list: PopupMenuItem[], path: string[]): MenuSpec["items"] {
    return list.map((it) => {
      const base = {
        id: it.id,
        title: it.title,
        icon: it.icon as any,
        enabled: it.enabled,
        useCustomRow: it.useCustomRow,
      } as any;
      if (it.items && it.items.length > 0) {
        return {
          ...base,
          items: walk(it.items, [...path, it.title]),
        };
      }
      // Leaf: register handler
      const fullPath = [...path, it.title];
      if (it.onSelect) {
        if (it.id) handlers.set(idKey(it.id), it.onSelect);
        handlers.set(pathKey(fullPath), it.onSelect);
      }
      return base;
    }) as any;
  }

  const menu: MenuSpec = {
    items: walk(items, []),
    header,
  };
  return { menu, handlers };
}

export const PopupMenu = forwardRef<PopupMenuHandle, PopupMenuProps>(
  function PopupMenu(props, ref) {
    const {
      items,
      header,
      style,
      onSelect,
      onDismiss,
      trigger = "press",
      useNativeView = false,
      anchorTag,
      wrapperStyle,
      children,
      disabled,
    } = props;

    const wrapperRef = useRef<React.ComponentRef<typeof Pressable>>(null);
    const viewRef = useRef<{ show: () => void }>(null);

    const { menu, handlers } = useMemo(() => toMenuSpec(items, header), [items, header]);

    const routeSelection = useCallback(
      (e: OnItemSelectedEvent) => {
        if (e.id && handlers.has(idKey(e.id))) {
          handlers.get(idKey(e.id))?.(e);
          return;
        }
        const key = pathKey(e.path);
        if (handlers.has(key)) {
          handlers.get(key)?.(e);
          return;
        }
        onSelect?.(e);
      },
      [handlers, onSelect]
    );

    const getAnchorTag = useCallback((): number | null => {
      if (typeof anchorTag === "number") return anchorTag;
      const node = findNodeHandle(wrapperRef.current) as number | null;
      return node ?? null;
    }, [anchorTag]);

    const showFunctionBased = useCallback(() => {
      const tag = getAnchorTag();
      if (typeof tag !== "number") return;

      // Ensure we pass a plain, serializable menu/style object to the native bridge
      const nativeMenu = JSON.parse(JSON.stringify(menu)) as MenuSpec;
      const nativeStyle = style ? (JSON.parse(JSON.stringify(style)) as PopupStyle) : undefined;

      let selSub: ListenerSubscription | undefined;
      let disSub: ListenerSubscription | undefined;

      selSub = addOnItemSelectedListener((e) => {
        selSub?.remove();
        disSub?.remove();
        routeSelection(e);
      });
      if (onDismiss) {
        disSub = addOnDismissListener(() => {
          selSub?.remove();
          disSub?.remove();
          onDismiss?.();
        });
      }

      void showMenu({ anchorTag: tag, menu: nativeMenu, style: nativeStyle });
    }, [getAnchorTag, menu, onDismiss, routeSelection, style]);

    const showViewBased = useCallback(() => {
      viewRef.current?.show();
    }, []);

    const show = useCallback(() => {
      if (useNativeView) showViewBased();
      else showFunctionBased();
    }, [showFunctionBased, showViewBased, useNativeView]);

    useImperativeHandle(ref, () => ({ show }), [show]);

    const triggerProps: Partial<React.ComponentProps<typeof Pressable>> = {};
    if (!disabled) {
      if (trigger === "press") triggerProps.onPress = show;
      else if (trigger === "longPress") triggerProps.onLongPress = show;
    }

    return (
      <>
        {children ? (
          <Pressable ref={wrapperRef} style={wrapperStyle} {...triggerProps}>
            {children}
          </Pressable>
        ) : null}

        {useNativeView ? (
          <CascadePopupMenuView
            ref={viewRef as any}
            menu={menu}
            styleSpec={style as PopupStyle}
            anchorTag={typeof anchorTag === "number" ? anchorTag : undefined}
            onItemSelected={routeSelection}
            onDismiss={onDismiss}
            style={{ width: 1, height: 1, opacity: 0 }}
          />
        ) : null}
      </>
    );
  }
);

export default PopupMenu;
