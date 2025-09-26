package expo.modules.overflowmenu

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class OverflowMenuModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("OverflowMenu")

    // Optional: example constants and functions retained from template
    Constant("PI") { Math.PI }
    Events("onChange")
    Function("hello") { "Hello world! 👋" }
    AsyncFunction("setValueAsync") { value: String ->
      sendEvent("onChange", mapOf("value" to value))
    }

    View(OverflowMenuView::class) {
      // Event emitted when a menu item is selected
      Events("onItemSelected")

      // Prop to set the menu items
      Prop("items") { view: OverflowMenuView, items: List<Map<String, Any?>>? ->
        view.setItems(items ?: emptyList())
      }
    }
  }
}
