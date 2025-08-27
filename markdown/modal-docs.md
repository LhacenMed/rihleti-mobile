read the docs here https://gorhom.dev/react-native-bottom-sheet/modal:
Usage

Here is a simple usage of the Bottom Sheet Modal, with non-scrollable content. For more scrollable usage please read Scrollables.

import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const App = () => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // renders
  return (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <Button
            onPress={handlePresentModalPress}
            title="Present Modal"
            color="black"
          />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
          >
            <BottomSheetView style={styles.contentContainer}>
              <Text>Awesome 🎉</Text>
            </BottomSheetView>
        </BottomSheetModal>
        </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default App;

Props

Bottom Sheet Modal inherits all Bottom Sheet props except for animateOnMount & containerHeight and also it introduces its own props:
Configuration
name

Modal name to help identify the modal for later on.
type    default    required
string    generated unique key    NO
stackBehavior

Available only on v3, for now.

Defines the stack behavior when modal mounts.

    push it will mount the modal on top of the current one.
    switch it will minimize the current modal then mount the new one.
    replace it will dismiss the current modal then mount the new one.

type    default    required
'push' | 'switch' | 'replace'    'switch'    NO
enableDismissOnClose

Dismiss the modal when it is closed, this will unmount the modal.
type    default    required
boolean    true    NO
Callbacks
onDismiss

Callback when the modal dismissed (unmounted).

type onDismiss = () => void;

type    default    required
function    null    NO
Components
containerComponent

Component to be placed as a bottom sheet container, this is to place the bottom sheet at the very top layer of your application when using FullWindowOverlay from React Native Screens. read more
type    default    required
React.ReactNode    undefined    NO

Methods

Bottom Sheet Modal inherits all Bottom Sheet methods and also it introduces its own methods.

These methods are accessible using the bottom sheet modal reference:

import React, { useRef } from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const App = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentPress = () => bottomSheetModalRef.current.present()
  return (
    <>
      <Button title="Present Sheet" onPress={handlePresentPress} />
      <BottomSheetModal ref={bottomSheetModalRef}>
    </>
  )
}

present

Mount and present the bottom sheet modal to the initial snap point.

type present = (
  // Data to be passed to the modal.
  data?: any
) => void;

dismiss

Close and unmount the bottom sheet modal.

type dismiss = (
  // AnimationConfigs snap animation configs.
  animationConfigs?: WithSpringConfig | WithTimingConfig
) => void;

Hooks
useBottomSheetModal

This hook provides modal functionalities only, for sheet functionalities please look at Bottom Sheet Hooks.

    This hook works at any component in BottomSheetModalProvider.

import React from 'react';
import { View, Button } from 'react-native';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

const SheetContent = () => {
  const { dismiss, dismissAll } = useBottomSheetModal();

  return (
    <View>
      <Button onPress={dismiss}>
    </View>
  )
}

dismiss

type dismiss = (key?: string) => void;

Dismiss a modal by its name/key, if key is not provided, then it will dismiss the last presented modal.
dismissAll

type dismissAll = () => void;

Dismiss all mounted/presented modals.