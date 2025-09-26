import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './HelloModule.types';

type HelloModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class HelloModule extends NativeModule<HelloModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(HelloModule, 'HelloModule');
