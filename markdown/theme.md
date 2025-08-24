# Theme Management Implementation Guide

Complete guide to implement theme management in your Expo React Native app with NativeWind.

## 📋 Prerequisites

- Expo React Native project
- NativeWind configured
- TypeScript (recommended)

## 🚀 Installation

First, install the required dependency:

```bash
npm install @react-native-async-storage/async-storage
```

Or with yarn:

```bash
yarn add @react-native-async-storage/async-storage
```

## 📁 Project Structure

Create the following file structure in your project:

```
src/
├── contexts/
│   └── ThemeContext.tsx
├── components/
│   └── ThemeToggleButton.tsx
└── App.tsx
```

## 🛠️ Implementation Steps

### Step 1: Create the Theme Context

Create `src/contexts/ThemeContext.tsx` and copy the theme context code from the previous artifact.

Key features included:
- ✅ Light, Dark, and System theme modes
- ✅ AsyncStorage persistence
- ✅ System theme detection
- ✅ NativeWind integration
- ✅ TypeScript support
- ✅ Loading states
- ✅ Error handling

### Step 2: Configure NativeWind

Update your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom theme colors
        primary: {
          DEFAULT: '#007AFF',
          dark: '#0A84FF',
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#000000',
        },
        foreground: {
          DEFAULT: '#000000',
          dark: '#ffffff',
        },
        muted: {
          DEFAULT: '#F2F2F7',
          dark: '#1C1C1E',
        },
        border: {
          DEFAULT: '#C6C6C8',
          dark: '#38383A',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#1C1C1E',
        },
        'text-primary': {
          DEFAULT: '#000000',
          dark: '#ffffff',
        },
        'text-secondary': {
          DEFAULT: '#3C3C43',
          dark: '#EBEBF5',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Important for NativeWind dark mode
}
```

### Step 3: Wrap Your App

Update your `App.tsx`:

```tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/contexts/ThemeContext';
import YourMainAppComponent from './src/YourMainAppComponent';

export default function App() {
  return (
    <ThemeProvider>
      <YourMainAppComponent />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
```

### Step 4: Create Theme Toggle Component

Create `src/components/ThemeToggleButton.tsx`:

```tsx
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggleButton() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <View className="flex-row gap-2 p-4">
      {/* Quick toggle button */}
      <TouchableOpacity
        onPress={toggleTheme}
        className="bg-primary dark:bg-primary-dark px-4 py-2 rounded-lg flex-1"
      >
        <Text className="text-white text-center font-medium">
          Toggle ({resolvedTheme})
        </Text>
      </TouchableOpacity>

      {/* System theme button */}
      <TouchableOpacity
        onPress={() => setTheme('system')}
        className={`px-4 py-2 rounded-lg border ${
          theme === 'system' 
            ? 'bg-primary dark:bg-primary-dark border-primary dark:border-primary-dark' 
            : 'bg-card dark:bg-card border-border dark:border-border'
        }`}
      >
        <Text className={`text-center font-medium ${
          theme === 'system' 
            ? 'text-white' 
            : 'text-text-primary dark:text-text-primary'
        }`}>
          System
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Step 5: Use Theme in Components

Example of using the theme in any component:

```tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme, useThemeColors } from '../contexts/ThemeContext';
import { ThemeToggleButton } from '../components/ThemeToggleButton';

export function ExampleScreen() {
  const { resolvedTheme } = useTheme();
  const colors = useThemeColors();

  return (
    <ScrollView className="flex-1 bg-background dark:bg-background">
      <View className="p-4">
        <Text className="text-2xl font-bold text-text-primary dark:text-text-primary mb-4">
          Theme Example
        </Text>
        
        <View className="bg-card dark:bg-card p-4 rounded-xl mb-4 border border-border dark:border-border">
          <Text className="text-text-primary dark:text-text-primary mb-2">
            Current Theme: {resolvedTheme}
          </Text>
          <Text className="text-text-secondary dark:text-text-secondary">
            This card adapts to the current theme automatically
          </Text>
        </View>

        <ThemeToggleButton />

        {/* Using programmatic colors */}
        <View 
          style={{ backgroundColor: colors.muted }} 
          className="p-4 rounded-xl mt-4"
        >
          <Text style={{ color: colors.text }}>
            Using programmatic colors from useThemeColors hook
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
```

## 🎨 Using Themes in Your Components

### Method 1: NativeWind Classes (Recommended)

```tsx
<View className="bg-background dark:bg-background">
  <Text className="text-text-primary dark:text-text-primary">
    Themed text
  </Text>
</View>
```

### Method 2: Programmatic Colors

```tsx
const colors = useThemeColors();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>
    Themed text
  </Text>
</View>
```

### Method 3: Conditional Styling

```tsx
const { resolvedTheme } = useTheme();

<View className={`p-4 ${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
  <Text>Conditionally styled</Text>
</View>
```

## 🔧 Advanced Configuration

### Custom Theme Colors

Add your brand colors to the theme:

```tsx
// In ThemeContext.tsx, update the colors object
const colors = {
  light: {
    background: '#ffffff',
    primary: '#your-brand-color',
    secondary: '#your-secondary-color',
    // ... other colors
  },
  dark: {
    background: '#000000',
    primary: '#your-brand-color-dark',
    secondary: '#your-secondary-color-dark',
    // ... other colors
  },
};
```

### Theme Persistence Key

Change the storage key if needed:

```tsx
const THEME_STORAGE_KEY = '@your_app_theme';
```

### Loading Screen

Handle the loading state in your App.tsx:

```tsx
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { isLoading } = useTheme(); // Add this to context if needed
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return <YourMainApp />;
}
```

## 🐛 Troubleshooting

### Theme Not Applying

1. Ensure `darkMode: 'class'` is set in `tailwind.config.js`
2. Verify NativeWind is properly configured
3. Check that `setColorScheme()` is being called

### AsyncStorage Errors

1. Ensure AsyncStorage is properly linked
2. Handle storage errors gracefully (already included in the implementation)

### Type Errors

1. Make sure you're using TypeScript
2. Import types correctly from the context

### Performance Issues

1. Use `React.memo()` for components that don't need frequent re-renders
2. The context is optimized to prevent unnecessary re-renders

## 🎯 Best Practices

1. **Always use the `useTheme` hook** instead of accessing context directly
2. **Prefer NativeWind classes** over programmatic styling when possible
3. **Test in both light and dark modes** during development
4. **Handle system theme changes** gracefully
5. **Use semantic color names** in your theme (primary, secondary, etc.)
6. **Provide fallback colors** for edge cases

## 📱 Testing Your Implementation

1. Toggle between light and dark modes
2. Test system theme detection
3. Close and reopen the app to verify persistence
4. Test on both iOS and Android
5. Check accessibility in both themes

## 🚨 Common Mistakes to Avoid

- ❌ Don't use `useState` for global theme state
- ❌ Don't forget to wrap your app with `ThemeProvider`
- ❌ Don't hardcode theme colors in components
- ❌ Don't ignore loading states
- ❌ Don't forget to test system theme changes

That's it! You now have a complete, production-ready theme management system for your Expo React Native app with NativeWind. 🎉