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
)

class OverflowMenuView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  // Event dispatched to JS when a menu item is selected.
  private val onItemSelected by EventDispatcher()

  private var items: List<MenuItemSpec> = emptyList()

  // Simple visual anchor: a centered vertical-ellipsis character.
  private val anchorView: TextView = TextView(context).apply {
    text = "\u22EE" // ⋮ vertical ellipsis
    setTextSize(TypedValue.COMPLEX_UNIT_SP, 20f)
    isClickable = false
    isFocusable = false
    layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    gravity = Gravity.CENTER
  }

  init {
    isClickable = true
    isFocusable = true
    addView(anchorView)

    setOnClickListener {
      showMenu()
    }
  }

  fun setItems(rawItems: List<Map<String, Any?>>) {
    items = rawItems.map { map ->
      val id = (map["id"] as? String) ?: (map["id"] as? Number)?.toString()
      val title = (map["title"] as? String) ?: ""
      val enabled = (map["enabled"] as? Boolean) ?: true
      MenuItemSpec(id = id, title = title, enabled = enabled)
    }
  }

  private fun showMenu() {
    if (items.isEmpty()) return
    val popup = PopupMenu(context, this)
    items.forEachIndexed { index, item ->
      val menuItem = popup.menu.add(Menu.NONE, index, index, item.title)
      menuItem.isEnabled = item.enabled
    }
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
}
