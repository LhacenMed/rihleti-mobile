### Icons in this project (Ionicons, Heroicons, Material Icons)

This guide shows how to import and use the icon sets available in the app:

- Ionicons via Expo Vector Icons
- Heroicons (SVG)
- Material Icons via Expo Vector Icons

All examples are React Native/Expo compatible.

## Ionicons (Expo Vector Icons)

Ionicons come bundled with Expo, so you can import them directly. No extra install needed.

```tsx
import { Ionicons } from "@expo/vector-icons";

export function ExampleIonicon() {
  return (
    <Ionicons name="home" size={24} color="#111827" />
  );
}
```

- name: use any Ionicons name (e.g., "home", "search", "chevron-forward").
- size: number (px).
- color: any valid color string.

Using with Pressable/Button:

```tsx
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function IconButton() {
  return (
    <Pressable style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      <Ionicons name="add" size={20} color="#fff" />
      <Text style={{ color: "#fff" }}>Add item</Text>
    </Pressable>
  );
}
```

## Heroicons (react-native-heroicons)

Heroicons are SVG icons that work via `react-native-svg`. You can switch between `solid` and `outline` sets.

```tsx
import { View } from "react-native";
import { HomeIcon } from "react-native-heroicons/outline";
import { BellIcon as BellSolid } from "react-native-heroicons/solid";

export function ExampleHeroicons() {
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <HomeIcon size={24} color="#111827" />
      <BellSolid size={24} color="#111827" />
    </View>
  );
}
```

Notes:
- For Heroicons, use `size` and `color` props (they render as SVGs).
- Outline set: `react-native-heroicons/outline`.
- Solid set: `react-native-heroicons/solid`.

## Material Icons (Expo Vector Icons)

Use Material Icons via Expo Vector Icons for the smoothest Expo integration.

```tsx
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export function ExampleMaterial() {
  return (
    <>
      <MaterialIcons name="favorite" size={22} color="#ef4444" />
      <MaterialCommunityIcons name="map-marker" size={22} color="#111827" />
    </>
  );
}
```

Tip: Prefer `@expo/vector-icons` imports in Expo apps over direct `react-native-vector-icons` to avoid native linking work.

## Theming and colors

If you use a theme context or tailwind classes, pass the resolved color into the icon `color` prop and a numeric `size`. For example, using a simple prop pattern:

```tsx
type ThemedIconProps = {
  color: string;
  size?: number;
};

export function ThemedHomeIcon({ color, size = 24 }: ThemedIconProps) {
  return <Ionicons name="home" size={size} color={color} />;
}
```

## Common patterns

### Inside inputs or buttons

```tsx
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function SearchInput() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Ionicons name="search" size={18} color="#6b7280" />
      <TextInput placeholder="Search" style={{ flex: 1 }} />
    </View>
  );
}
```

### Conditional icons (state-based)

```tsx
import { Ionicons } from "@expo/vector-icons";

export function PasswordEye({ visible }: { visible: boolean }) {
  return (
    <Ionicons
      name={visible ? "eye" : "eye-off"}
      size={18}
      color="#6b7280"
    />
  );
}
```

## Performance tips

- Reuse icons in JSX; avoid creating new inline objects for `style` on every render.
- Prefer numeric `size` values and pass plain string colors.
- For frequently re-rendered lists, wrap icon rows with `React.memo`.

## Troubleshooting

- If an icon name renders as an empty box, verify the name exists in that set.
- In web builds, ensure `react-native-svg` is configured (Heroicons rely on it). Expo SDK 53 includes this by default.
- When using `react-native-paper`, its default icon set is Material Community Icons; you can still pass custom renderers where needed.

## Quick reference

- Ionicons: `import { Ionicons } from "@expo/vector-icons";`
- Material Icons: `import { MaterialIcons } from "@expo/vector-icons";`
- Material Community Icons: `import { MaterialCommunityIcons } from "@expo/vector-icons";`
- Heroicons (outline): `import { XIcon } from "react-native-heroicons/outline";`
- Heroicons (solid): `import { XIcon as XSolid } from "react-native-heroicons/solid";`


