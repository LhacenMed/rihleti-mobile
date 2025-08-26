import React, { useRef, useEffect } from "react";
import { Text, View, Animated, TouchableWithoutFeedback, BackHandler } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { ModalContentProps } from "@whitespectre/rn-modal-presenter";
import { useTheme } from "@contexts/ThemeContext";
import * as Haptic from "expo-haptics";

// Types
interface ModalButton {
  text: string;
  onPress?: () => void;
  style?: string;
}

interface ModalProps {
  header?: string;
  title?: string;
  subtitle?: string;
  hasHeader?: boolean;
  children?: React.ReactNode;
  buttons?: ModalButton[];
}

// Constants
const ANIMATION_DURATION = 150;
const DISMISS_DURATION = 100;
const BUTTON_COLORS = {
  destructive: "#FF453A",
  cancel: "#8E8E93",
  default: "#007AFF",
};

// Custom Hooks
const useModalAnimations = () => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = (onComplete: () => void) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1.1,
        duration: DISMISS_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: DISMISS_DURATION,
        useNativeDriver: true,
      }),
    ]).start(onComplete);
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1, 1.2],
    outputRange: [25, 0, -25],
  });

  return { fadeAnim, translateY, animateIn, animateOut };
};

const useModalEffects = (animateIn: () => void, dismiss: () => void) => {
  useEffect(() => {
    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
    animateIn();
  }, [animateIn]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      dismiss();
      return true;
    });

    return () => backHandler.remove();
  }, [dismiss]);
};

// Components
const ModalButton = ({
  button,
  index,
  totalButtons,
  onPress,
}: {
  button: ModalButton;
  index: number;
  totalButtons: number;
  onPress: (button: ModalButton) => void;
}) => {
  const getButtonMode = (style?: string) => {
    switch (style) {
      case "destructive":
        return "contained";
      case "cancel":
        return "text";
      default:
        return "text";
    }
  };

  const getButtonColor = (style?: string) => {
    return BUTTON_COLORS[style as keyof typeof BUTTON_COLORS] || BUTTON_COLORS.default;
  };

  return (
    <View style={{ flex: 1 }}>
      <PaperButton
        mode={getButtonMode(button.style)}
        onPress={() => onPress(button)}
        textColor={getButtonColor(button.style)}
        buttonColor="transparent"
        style={{ borderRadius: 0, height: 40 }}
        contentStyle={{ height: 40 }}
      >
        {button.text}
      </PaperButton>
      {/* Only show separator if there are multiple buttons and this isn't the last one */}
      {totalButtons > 1 && index < totalButtons - 1 && (
        <View className="absolute bottom-0 right-0 top-0 w-px bg-border" />
      )}
    </View>
  );
};

const ModalHeader = ({ header }: { header: string }) => (
  <View className="border-b border-border px-4 py-4">
    <Text className="text-center text-lg font-semibold text-card-foreground">{header}</Text>
  </View>
);

const ModalBody = ({
  hasHeader,
  children,
  title,
  subtitle,
}: {
  hasHeader?: boolean;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
}) => {
  if (hasHeader && children) {
    return <View className="px-4 py-5">{children}</View>;
  }

  if (title && subtitle) {
    return (
      <View className="px-4 py-5">
        <Text className="mb-3 text-center text-lg font-semibold text-card-foreground">{title}</Text>
        <Text className="text-md text-center leading-5 text-muted-foreground">{subtitle}</Text>
      </View>
    );
  }

  return null;
};

const ModalFooter = ({
  buttons,
  onButtonPress,
}: {
  buttons: ModalButton[];
  onButtonPress: (button: ModalButton) => void;
}) => {
  console.log("ModalFooter rendered with buttons:", buttons);

  if (!buttons || buttons.length === 0) {
    console.log("No buttons to render");
    return null;
  }

  return (
    <View className="border-t border-border">
      <View className="flex-row">
        {buttons.map((button, index) => (
          <ModalButton
            key={index}
            button={button}
            index={index}
            totalButtons={buttons.length}
            onPress={onButtonPress}
          />
        ))}
      </View>
    </View>
  );
};

// Main Modal Component
const Modal = ({
  dismiss,
  header,
  title,
  subtitle,
  hasHeader,
  children,
  buttons = [{ text: "OK" }],
}: ModalProps & ModalContentProps) => {
  const { isDark } = useTheme();
  const { fadeAnim, translateY, animateIn, animateOut } = useModalAnimations();

  const handleDismiss = () => {
    animateOut(() => dismiss());
  };

  const handleButtonPress = (button: ModalButton) => {
    button.onPress?.();
    handleDismiss();
  };

  useModalEffects(animateIn, handleDismiss);

  return (
    <TouchableWithoutFeedback onPress={handleDismiss}>
      <Animated.View
        className="absolute inset-0 items-center justify-center px-8"
        style={{ opacity: fadeAnim }}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <Animated.View
            className="w-full max-w-[250px] overflow-hidden rounded-3xl bg-modal-background"
            style={{ transform: [{ translateY }] }}
          >
            {header && <ModalHeader header={header} />}

            <ModalBody
              hasHeader={hasHeader}
              children={children}
              title={title}
              subtitle={subtitle}
            />

            <ModalFooter buttons={buttons} onButtonPress={handleButtonPress} />
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Modal;
