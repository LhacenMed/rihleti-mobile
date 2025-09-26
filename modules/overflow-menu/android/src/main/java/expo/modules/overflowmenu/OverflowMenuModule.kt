// modules/overflow-menu/android/src/java/expo/modules/overflowmenu/OverflowMenuModule.kt
package expo.modules.overflowmenu

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class OverflowMenuModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("OverflowMenu")

    // Optional: keep simple example API
    Constant("PI") { Math.PI }
    Events("onChange")
    Function("hello") { "Hello world! 👋" }
    AsyncFunction("setValueAsync") { value: String ->
      sendEvent("onChange", mapOf("value" to value))
    }

    View(OverflowMenuView::class) {
      // View events
      Events("onItemSelected")

      // Props
      Prop("items") { view: OverflowMenuView, items: List<Map<String, Any?>>? ->
        view.setItems(items ?: emptyList())
      }
      Prop("title") { view: OverflowMenuView, title: String? ->
        view.setTitle(title)
      }
    }
  }
}
