// typings/stream-types.d.ts

import "stream-chat";

declare module "stream-chat" {
  interface CustomUserData {
    email?: string;
    name?: string;
    avatar?: string;
    // add any other custom user metadata fields you want
  }
}
