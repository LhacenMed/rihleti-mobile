// modules/overflow-menu/android/src/java/expo/modules/overflowmenu/OverflowMenuView.kt
package expo.modules.overflowmenu

import android.content.Context
import android.view.Gravity
import android.view.Menu
import android.widget.PopupMenu
import android.widget.TextView
import android.util.TypedValue
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

private data class MenuItemSpec(
  val id: String?,
  val title: String,
  val enabled: Boolean = true,
  val iconName: String? = null,
)

class OverflowMenuView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  // Event dispatched to JS when a menu item is selected.
  private val onItemSelected by EventDispatcher()

  private var items: List<MenuItemSpec> = emptyList()


  init {
    isClickable = true
    isFocusable = true

    setOnClickListener {
      showMenu()
    }
  }

  fun setItems(rawItems: List<Map<String, Any?>>) {
    items = rawItems.map { map ->
      val id = (map["id"] as? String) ?: (map["id"] as? Number)?.toString()
      val title = (map["title"] as? String) ?: ""
      val enabled = (map["enabled"] as? Boolean) ?: true
      val iconName = (map["icon"] as? String)
      MenuItemSpec(id = id, title = title, enabled = enabled, iconName = iconName)
    }
  }

  fun showMenu() {
    if (items.isEmpty()) return
    val popup = PopupMenu(context, this)
    items.forEachIndexed { index, item ->
      val menuItem = popup.menu.add(Menu.NONE, index, index, item.title)
      menuItem.isEnabled = item.enabled
      // Set icon if provided
      item.iconName?.let { name ->
        val resId = context.resources.getIdentifier(name, "drawable", context.packageName)
        if (resId != 0) {
          menuItem.setIcon(resId)
        }
      }
    }
    // Best-effort to force icons to display in the popup menu
    tryForceShowMenuIcons(popup)
    popup.setOnMenuItemClickListener { menuItem ->
      val idx = menuItem.itemId
      val item = items.getOrNull(idx)
      if (item != null) {
        val payload = mutableMapOf<String, Any>(
          "index" to idx,
          "title" to item.title,
        )
        item.id?.let { payload["id"] = it }
        onItemSelected(payload)
      }
      true
    }
    popup.show()
  }

  private fun tryForceShowMenuIcons(popup: PopupMenu) {
    try {
      val fields = popup.javaClass.getDeclaredField("mPopup")
      fields.isAccessible = true
      val menuPopupHelper = fields.get(popup)
      val classPopupHelper = menuPopupHelper.javaClass
      val setForceIcons = classPopupHelper.getDeclaredMethod("setForceShowIcon", Boolean::class.javaPrimitiveType)
      setForceIcons.invoke(menuPopupHelper, true)
    } catch (_: Exception) {
      // Ignore; icons may simply not be displayed depending on device/OS.
    }
  }
}
