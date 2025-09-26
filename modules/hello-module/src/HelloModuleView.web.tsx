import * as React from 'react';

import { HelloModuleViewProps } from './HelloModule.types';

export default function HelloModuleView(props: HelloModuleViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
