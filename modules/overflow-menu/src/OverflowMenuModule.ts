import { NativeModule, requireNativeModule } from "expo";

import { OverflowMenuModuleEvents } from "./OverflowMenu.types";

declare class OverflowMenuModule extends NativeModule<OverflowMenuModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<OverflowMenuModule>("OverflowMenu");
