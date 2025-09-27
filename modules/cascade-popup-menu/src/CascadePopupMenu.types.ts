export type IconSpec = {
  /** Name of an Android drawable resource (without extension), e.g. "ic_menu_share" */
  resource?: string
  /** Base64-encoded PNG/JPEG data (data URI prefix optional) */
  base64?: string
}

export type MenuItemSpec = {
  /** Stable id you can use to identify selection in JS */
  id?: string
  title: string
  /** Optional icon for the item */
  icon?: IconSpec
  /** If true, renders the row using a custom layout to guarantee icon display */
  useCustomRow?: boolean
  /** Disabled state */
  enabled?: boolean
  /** Optional nested submenu items */
  items?: MenuItemSpec[]
}

export type MenuSpec = {
  /** Top-level items */
  items: MenuItemSpec[]
  /** Optional header for top menu or submenus */
  header?: string
}

export type PopupStyle = {
  /** Text size in SP for custom rows */
  textSizeSp?: number
  /** Horizontal padding in DP for custom rows */
  itemPaddingHorizontalDp?: number
  /** Row height in DP for custom rows */
  itemHeightDp?: number
  /** ARGB hex color string for background (e.g. #FFFFFFFF) when using custom rows */
  backgroundColor?: string
  /** Elevation in DP (applied to popup window when supported) */
  elevationDp?: number
  /** Optional drawable resource name for submenu arrow */
  submenuArrowResource?: string
  /** If true, force all rows to use the custom row layout */
  forceCustomRow?: boolean
}

export type ShowOptions = {
  /** Native view tag to anchor the popup to (findNodeHandle result) */
  anchorTag: number
  menu: MenuSpec
  style?: PopupStyle
}

export type OnItemSelectedEvent = {
  id?: string
  title: string
  /** Titles chain from root to the clicked item */
  path: string[]
}

export type CascadePopupMenuViewProps = {
  /** Menu config for the view-based usage */
  menu?: MenuSpec
  /** Styling options */
  styleSpec?: PopupStyle
  /** Anchor any external RN view by native tag; otherwise the view anchors to itself */
  anchorTag?: number
  /** Selection event (view-scoped) */
  onItemSelected?: (e: OnItemSelectedEvent) => void
  /** Dismiss event (view-scoped) */
  onDismiss?: () => void
  /** Standard React Native style */
  style?: any
}
