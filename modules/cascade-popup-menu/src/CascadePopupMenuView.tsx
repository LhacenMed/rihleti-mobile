import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { findNodeHandle } from 'react-native'
import { requireNativeViewManager } from 'expo-modules-core'
import type { CascadePopupMenuViewProps } from './CascadePopupMenu.types'
import { showMenu as showMenuModule } from './CascadePopupMenuModule'

const NativeView: any = requireNativeViewManager('CascadePopupMenuView')

export type CascadePopupMenuViewHandle = {
  /** Imperatively open the popup anchored to this view (or anchorTag prop if provided). */
  show: () => void
}

export const CascadePopupMenuView = forwardRef<CascadePopupMenuViewHandle, CascadePopupMenuViewProps>(
  function CascadePopupMenuView(props, ref) {
    const nativeRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
      show: () => {
        const explicitAnchor = props.anchorTag
        const fallbackAnchor = findNodeHandle(nativeRef.current) as number | null
        const anchorTag = explicitAnchor ?? fallbackAnchor
        if (!anchorTag) return
        const menu = props.menu ?? { items: [] }
        void showMenuModule({ anchorTag, menu, style: props.styleSpec })
      },
    }))

    return <NativeView ref={nativeRef} {...props} />
  }
)
