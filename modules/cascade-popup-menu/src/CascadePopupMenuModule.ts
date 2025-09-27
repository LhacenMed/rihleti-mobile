import { requireNativeModule } from 'expo-modules-core'
import type { ShowOptions, OnItemSelectedEvent } from './CascadePopupMenu.types'

// Native module name must match Kotlin Module Name("CascadePopupMenu")
const NativeModule = requireNativeModule<any>('CascadePopupMenu')

export async function showMenu(options: ShowOptions): Promise<void> {
  const { anchorTag, menu, style } = options
  return NativeModule.showMenu(anchorTag, menu, style ?? {})
}

// Expo SDK 52+: NativeModule already implements an event emitter interface.
// Define a minimal subscription type compatible with addListener's return value.
export type ListenerSubscription = { remove: () => void }

export function addOnItemSelectedListener(listener: (e: OnItemSelectedEvent) => void): ListenerSubscription {
  return NativeModule.addListener('onItemSelected', listener)
}

export function addOnDismissListener(listener: () => void): ListenerSubscription {
  return NativeModule.addListener('onDismiss', listener)
}

export default NativeModule
