# Animated Splash Screen Implementation Guide

This guide explains how to implement an animated splash screen in React Native using Lottie animations, similar to the implementation in this app.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Step 1: Install Dependencies](#step-1-install-dependencies)
- [Step 2: Create the Splash Component](#step-2-create-the-splash-component)
- [Step 3: Add Lottie Animation](#step-3-add-lottie-animation)
- [Step 4: Integrate with App.tsx](#step-4-integrate-with-apptsx)
- [Step 5: Handle Font Loading](#step-5-handle-font-loading)
- [Step 6: Customize Animation](#step-6-customize-animation)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- React Native project set up
- Basic understanding of React Native components
- Expo project (recommended for easier setup)

## Step 1: Install Dependencies

Install the required packages:

```bash
# For Expo projects
npx expo install lottie-react-native

# For bare React Native projects
npm install lottie-react-native
# or
yarn add lottie-react-native
```

## Step 2: Create the Splash Component

Create a new file `app/screens/Splash.tsx`:

```typescript
import { View, StyleSheet } from "react-native";
import React, { useRef } from "react";
import AnimatedLottieView from "lottie-react-native";

interface SplashProps {
  onAnimationFinish: (isCancelled: boolean) => void;
}

const Splash: React.FC<SplashProps> = ({
  onAnimationFinish = () => {},
}: {
  onAnimationFinish?: (isCancelled: boolean) => void;
}) => {
  const animation = useRef<AnimatedLottieView>(null);

  return (
    <View style={styles.animationContainer}>
      <AnimatedLottieView
        onAnimationFinish={onAnimationFinish}
        autoPlay
        loop={false}
        ref={animation}
        style={{
          width: "80%",
          maxWidth: 400,
          height: "80%",
          maxHeight: 400,
        }}
        source={require("../../assets/lottie/Logo.json")}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  animationContainer: {
    flex: 1,
    backgroundColor: "#fff", // Customize background color
    justifyContent: "center",
    alignItems: "center",
  },
});
```

## Step 3: Add Lottie Animation

1. **Create assets folder structure:**
   ```
   assets/
   └── lottie/
       └── Logo.json
   ```

2. **Get a Lottie animation file:**
   - Download from [LottieFiles](https://lottiefiles.com/)
   - Create your own using Adobe After Effects
   - Use a simple logo animation

3. **Place the JSON file** in `assets/lottie/Logo.json`

## Step 4: Integrate with App.tsx

Update your main `App.tsx` file:

```typescript
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Splash from "./app/screens/Splash";
// Import your other components...

export default function App() {
  // State management
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Add your other state variables here...

  // Handle font loading (if using custom fonts)
  const [fontsLoaded, fontError] = useFonts({
    // Your font configurations...
  });

  // Set app ready when fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  // Handle authentication or other initialization
  useEffect(() => {
    // Your initialization logic here
    // Example: check authentication status
    const initializeApp = async () => {
      // Your async initialization
      setLoading(false);
    };
    
    initializeApp();
  }, []);

  // Show splash screen until everything is ready
  if (!appReady || !splashAnimationFinished) {
    return (
      <Splash
        onAnimationFinish={(isCancelled) => {
          if (!isCancelled) {
            setSplashAnimationFinished(true);
          }
        }}
      />
    );
  }

  // Show loading indicator if still loading
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Your main app content
  return (
    // Your main app components...
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
```

## Step 5: Handle Font Loading

If you're using custom fonts, integrate with Expo Fonts:

```typescript
import { useFonts } from "expo-font";

// In your App component
const [fontsLoaded, fontError] = useFonts({
  "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
  "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
  // Add more fonts as needed
});

// The splash screen will wait for fonts to load
useEffect(() => {
  if (fontsLoaded || fontError) {
    setAppReady(true);
  }
}, [fontsLoaded, fontError]);
```

## Step 6: Customize Animation

### Animation Properties

```typescript
<AnimatedLottieView
  // Basic properties
  autoPlay={true}           // Start automatically
  loop={false}              // Play once
  speed={1}                 // Animation speed (1 = normal)
  
  // Callbacks
  onAnimationFinish={onAnimationFinish}
  onAnimationFailure={(error) => console.log(error)}
  
  // Styling
  style={{
    width: "80%",
    maxWidth: 400,
    height: "80%",
    maxHeight: 400,
  }}
  
  // Source
  source={require("../../assets/lottie/Logo.json")}
/>
```

### Custom Styling

```typescript
const styles = StyleSheet.create({
  animationContainer: {
    flex: 1,
    backgroundColor: "#1e1e1e", // Dark theme
    justifyContent: "center",
    alignItems: "center",
  },
  // Add gradient background
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
```

### Advanced Features

```typescript
// Control animation programmatically
const animation = useRef<AnimatedLottieView>(null);

// Play animation
animation.current?.play();

// Pause animation
animation.current?.pause();

// Reset animation
animation.current?.reset();

// Play specific frame range
animation.current?.play(30, 120);
```

## Troubleshooting

### Common Issues

1. **Animation not playing:**
   - Check if the JSON file path is correct
   - Verify the JSON file is valid
   - Ensure `autoPlay` is set to `true`

2. **Animation loops continuously:**
   - Set `loop={false}` to play only once

3. **Animation doesn't finish:**
   - Check the `onAnimationFinish` callback
   - Verify the animation has an end frame

4. **Performance issues:**
   - Use smaller animation files
   - Optimize the Lottie JSON
   - Consider using `useMemo` for complex animations

### Debug Tips

```typescript
// Add error handling
<AnimatedLottieView
  onAnimationFailure={(error) => {
    console.error("Animation failed:", error);
  }}
  onAnimationFinish={(isCancelled) => {
    console.log("Animation finished, cancelled:", isCancelled);
    onAnimationFinish(isCancelled);
  }}
/>
```

### Platform-Specific Issues

**iOS:**
- Ensure you have the latest version of `lottie-react-native`
- Check that the animation file is included in the bundle

**Android:**
- Verify the animation file is in the correct assets folder
- Check for any build configuration issues

## Best Practices

1. **Keep animations lightweight** - Large files can slow down app startup
2. **Use vector-based animations** - They scale well across different screen sizes
3. **Test on different devices** - Animation performance can vary
4. **Provide fallback** - Always have a loading state in case animation fails
5. **Consider accessibility** - Some users may prefer reduced motion

## Example Complete Implementation

See the current implementation in this project:
- `app/screens/Splash.tsx` - Splash component
- `App.tsx` - Main app integration
- `assets/lottie/Logo.json` - Animation file

This implementation provides a smooth, professional splash screen that enhances the user experience during app initialization.
