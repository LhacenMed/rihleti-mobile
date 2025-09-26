import { NativeModule, requireNativeModule } from 'expo';

import { HelloModuleEvents } from './HelloModule.types';

declare class HelloModule extends NativeModule<HelloModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<HelloModule>('HelloModule');
