import { requireNativeView } from 'expo';
import * as React from 'react';

import { HelloModuleViewProps } from './HelloModule.types';

const NativeView: React.ComponentType<HelloModuleViewProps> =
  requireNativeView('HelloModule');

export default function HelloModuleView(props: HelloModuleViewProps) {
  return <NativeView {...props} />;
}
