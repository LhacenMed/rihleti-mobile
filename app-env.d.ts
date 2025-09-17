/// <reference types="nativewind/types" />

// custom-types.d.ts
import {
  DefaultAttachmentData,
  DefaultChannelData,
  DefaultCommandData,
  DefaultEventData,
  DefaultMemberData,
  DefaultMessageData,
  DefaultPollData,
  DefaultPollOptionData,
  DefaultReactionData,
  DefaultThreadData,
  DefaultUserData,
} from "stream-chat-expo";

declare module "stream-chat" {
  /* eslint-disable @typescript-eslint/no-empty-object-type */

  interface CustomAttachmentData extends DefaultAttachmentData {}

  interface CustomChannelData extends DefaultChannelData {}

  interface CustomCommandData extends DefaultCommandData {}

  interface CustomEventData extends DefaultEventData {}

  interface CustomMemberData extends DefaultMemberData {}

  interface CustomUserData extends DefaultUserData {}

  interface CustomMessageData extends DefaultMessageData {}

  interface CustomPollOptionData extends DefaultPollOptionData {}

  interface CustomPollData extends DefaultPollData {}

  interface CustomReactionData extends DefaultReactionData {}

  interface CustomThreadData extends DefaultThreadData {}

  /* eslint-enable @typescript-eslint/no-empty-object-type */
}

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "*.opus" {
  const content: any;
  export default content;
}

declare module "*.mp3" {
  const content: any;
  export default content;
}

declare module "*.wav" {
  const content: any;
  export default content;
}

declare module "*.m4a" {
  const content: any;
  export default content;
}

declare module "expo-env" {
  export function getEnv<T extends string>(key: T): string | undefined;
}
