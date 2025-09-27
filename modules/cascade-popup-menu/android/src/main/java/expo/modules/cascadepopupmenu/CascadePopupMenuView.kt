// modules/cascade-popup-menu/android/src/java/expo/modules/cascadepopupmenu/CascadePopupMenuView.kt
package expo.modules.cascadepopupmenu

import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import android.util.Base64
import android.view.Menu
import android.view.MenuItem
import android.view.SubMenu
import android.view.View
import androidx.core.content.ContextCompat
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import me.saket.cascade.CascadePopupMenu

class CascadePopupMenuView(
  context: android.content.Context,
  appContext: AppContext
) : ExpoView(context, appContext) {

  var menuSpec: Map<String, Any?>? = null
  var styleSpec: Map<String, Any?>? = null
  var anchorTag: Int? = null

  // Events exposed in ModuleDefinition.View
  val onItemSelected by EventDispatcher()
  val onDismiss by EventDispatcher()

  fun show() {
    val anchor: View = anchorTag?.let { appContext.findView(it) as? View } ?: this
    val popup = CascadePopupMenu(context, anchor)

    val items = (menuSpec?.get("items") as? List<*>)?.filterIsInstance<Map<String, Any?>>().orEmpty()

    buildMenu(popup.menu, items, mutableListOf(), anchor, styleSpec) { id, title, path ->
      onItemSelected(
        mapOf(
          "id" to id,
          "title" to title,
          "path" to path
        ) as Map<String, Any>
      )
    }

    // TODO: If Cascade exposes a dismiss listener in a future version, forward it to onDismiss.
    // Currently, we omit an explicit dismiss callback to avoid build errors on this version.

    popup.show()
  }

  private fun buildMenu(
    menu: Menu,
    items: List<Map<String, Any?>>, 
    path: MutableList<String>,
    anchor: View,
    style: Map<String, Any?>?,
    onSelect: (id: String?, title: String, path: List<String>) -> Unit,
  ) {
    items.forEach { item ->
      val title = (item["title"] as? String) ?: return@forEach
      val id = item["id"] as? String
      val enabled = (item["enabled"] as? Boolean) ?: true
      val children = (item["items"] as? List<*>)?.filterIsInstance<Map<String, Any?>>()

      if (!children.isNullOrEmpty()) {
        val sub = menu.addSubMenu(title)
        (item["header"] as? String)?.let { sub.setHeaderTitle(it) }
        path.add(title)
        buildSubmenu(sub, children, path, anchor, style, onSelect)
        path.removeLastOrNull()
      } else {
        val numericId = id?.hashCode() ?: 0
        val mi = menu.add(Menu.NONE, numericId, Menu.NONE, title)
        mi.isEnabled = enabled

        (item["icon"] as? Map<*, *>)?.let { iconSpec ->
          setIconFromSpec(anchor, mi, iconSpec)
        }

        val useCustom = (item["useCustomRow"] as? Boolean) == true || (style?.get("forceCustomRow") as? Boolean) == true
        if (useCustom) {
          attachCustomRow(anchor, mi, title, item["icon"] as? Map<*, *>, style)
        }

        mi.setOnMenuItemClickListener {
          path.add(title)
          onSelect(id, title, path.toList())
          path.removeLastOrNull()
          true
        }
      }
    }
  }

  private fun buildSubmenu(
    sub: SubMenu,
    children: List<Map<String, Any?>>, 
    path: MutableList<String>,
    anchor: View,
    style: Map<String, Any?>?,
    onSelect: (id: String?, title: String, path: List<String>) -> Unit,
  ) {
    children.forEach { child ->
      val title = (child["title"] as? String) ?: return@forEach
      val id = child["id"] as? String
      val enabled = (child["enabled"] as? Boolean) ?: true
      val grandkids = (child["items"] as? List<*>)?.filterIsInstance<Map<String, Any?>>()

      if (!grandkids.isNullOrEmpty()) {
        val nested = sub.addSubMenu(title)
        path.add(title)
        buildSubmenu(nested, grandkids, path, anchor, style, onSelect)
        path.removeLastOrNull()
      } else {
        val numericId = id?.hashCode() ?: 0
        val mi = sub.add(Menu.NONE, numericId, Menu.NONE, title)
        mi.isEnabled = enabled

        (child["icon"] as? Map<*, *>)?.let { iconSpec ->
          setIconFromSpec(anchor, mi, iconSpec)
        }

        val useCustom = (child["useCustomRow"] as? Boolean) == true || (style?.get("forceCustomRow") as? Boolean) == true
        if (useCustom) {
          attachCustomRow(anchor, mi, title, child["icon"] as? Map<*, *>, style)
        }

        mi.setOnMenuItemClickListener {
          path.add(title)
          onSelect(id, title, path.toList())
          path.removeLastOrNull()
          true
        }
      }
    }
  }

  private fun setIconFromSpec(anchor: View, mi: MenuItem, iconSpec: Map<*, *>) {
    val resName = iconSpec["resource"] as? String
    val base64 = iconSpec["base64"] as? String

    if (!resName.isNullOrBlank()) {
      val resId = anchor.resources.getIdentifier(resName, "drawable", anchor.context.packageName)
      if (resId != 0) {
        mi.icon = ContextCompat.getDrawable(anchor.context, resId)
        return
      }
    }

    if (!base64.isNullOrBlank()) {
      try {
        val clean = base64.substringAfter(",", base64)
        val bytes = Base64.decode(clean, Base64.DEFAULT)
        val bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
        mi.icon = BitmapDrawable(anchor.resources, bmp)
      } catch (_: Throwable) {
        // ignore
      }
    }
  }

  private fun attachCustomRow(
    anchor: View,
    mi: MenuItem,
    title: String,
    iconSpec: Map<*, *>?,
    style: Map<String, Any?>?,
  ) {
    val inflater = android.view.LayoutInflater.from(anchor.context)
    val row = inflater.inflate(R.layout.menu_item_cascade_row, null)
    val tv = row.findViewById<android.widget.TextView>(R.id.cascade_row_title)
    val iv = row.findViewById<android.widget.ImageView>(R.id.cascade_row_icon)

    tv.text = title

    (style?.get("textSizeSp") as? Number)?.toFloat()?.let { tv.textSize = it }
    val paddingH = (style?.get("itemPaddingHorizontalDp") as? Number)?.toInt()
    val itemHeight = (style?.get("itemHeightDp") as? Number)?.toInt()
    if (paddingH != null || itemHeight != null) {
      val ph = paddingH ?: 12
      val heightPx = if (itemHeight != null) (itemHeight * anchor.resources.displayMetrics.density).toInt() else android.view.ViewGroup.LayoutParams.WRAP_CONTENT
      row.setPadding((ph * anchor.resources.displayMetrics.density).toInt(), row.paddingTop, (ph * anchor.resources.displayMetrics.density).toInt(), row.paddingBottom)
      row.layoutParams = android.view.ViewGroup.LayoutParams(android.view.ViewGroup.LayoutParams.MATCH_PARENT, heightPx)
    }

    if (iconSpec != null) {
      val resName = iconSpec["resource"] as? String
      val base64 = iconSpec["base64"] as? String
      if (!resName.isNullOrBlank()) {
        val resId = anchor.resources.getIdentifier(resName, "drawable", anchor.context.packageName)
        if (resId != 0) iv.setImageResource(resId)
      } else if (!base64.isNullOrBlank()) {
        try {
          val clean = base64.substringAfter(",", base64)
          val bytes = Base64.decode(clean, Base64.DEFAULT)
          val bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
          iv.setImageBitmap(bmp)
        } catch (_: Throwable) { }
      }
    }

    mi.actionView = row
  }
}
