// modules/overflow-menu/android/src/java/expo/modules/overflowmenu/OverflowMenuView.kt
package expo.modules.overflowmenu

import android.content.Context
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

private data class MenuItemSpec(
  val id: String?,
  val title: String,
  val enabled: Boolean = true,
)

class OverflowMenuView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onItemSelected by EventDispatcher()

  private var items: List<MenuItemSpec> = emptyList()
  private var menuProvider: MenuProvider? = null
  private var attached = false

  private val toolbar: Toolbar = Toolbar(context).apply {
    layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT)
    // Height will be controlled by JS style; default WRAP_CONTENT
  }

  init {
    addView(toolbar)
  }

  fun setTitle(title: String?) {
    toolbar.title = title ?: ""
  }

  fun setItems(rawItems: List<Map<String, Any?>>) {
    items = rawItems.map { map ->
      val id = (map["id"] as? String) ?: (map["id"] as? Number)?.toString()
      val title = (map["title"] as? String) ?: ""
      val enabled = (map["enabled"] as? Boolean) ?: true
      MenuItemSpec(id = id, title = title, enabled = enabled)
    }
    invalidateHostMenu()
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    if (!attached) {
      attachToActivity()
      attached = true
    }
  }

  override fun onDetachedFromWindow() {
    detachFromActivity()
    attached = false
    super.onDetachedFromWindow()
  }

  private fun attachToActivity() {
    val activity = appContext.currentActivity as? AppCompatActivity ?: return

    // Install this toolbar as the activity's support ActionBar for true native behavior
    activity.setSupportActionBar(toolbar)

    val menuHost = activity as? MenuHost ?: return
    val lifecycleOwner = activity as? LifecycleOwner ?: return

    val provider = object : MenuProvider {
      override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
        buildMenu(menu)
      }

      override fun onMenuItemSelected(menuItem: MenuItem): Boolean {
        val idx = menuItem.itemId
        val spec = items.getOrNull(idx)
        if (spec != null) {
          val payload = mutableMapOf<String, Any>(
            "index" to idx,
            "title" to spec.title,
          )
          spec.id?.let { payload["id"] = it }
          onItemSelected(payload)
          return true
        }
        return false
      }

      override fun onPrepareMenu(menu: Menu) {
        // Called before showing; can enable/disable dynamically
        // Rebuild to reflect latest state
        menu.clear()
        buildMenu(menu)
      }

      private fun buildMenu(menu: Menu) {
        menu.clear()
        items.forEachIndexed { index, item ->
          val mi = menu.add(Menu.NONE, index, index, item.title)
          mi.isEnabled = item.enabled
          // By default, items without showAsAction end up in overflow
        }
      }
    }

    menuHost.addMenuProvider(provider, lifecycleOwner, Lifecycle.State.RESUMED)
    menuProvider = provider

    // Ensure initial menu state reflects current items
    invalidateHostMenu()
  }

  private fun detachFromActivity() {
    val activity = appContext.currentActivity as? AppCompatActivity ?: return
    val menuHost = activity as? MenuHost
    menuProvider?.let { provider ->
      menuHost?.removeMenuProvider(provider)
      menuProvider = null
    }
    // Optionally detach the toolbar from ActionBar when view is removed
    activity.setSupportActionBar(null)
  }

  private fun invalidateHostMenu() {
    val activity = appContext.currentActivity as? AppCompatActivity ?: return
    // Invalidate options menu to refresh items
    activity.invalidateOptionsMenu()
  }
}
