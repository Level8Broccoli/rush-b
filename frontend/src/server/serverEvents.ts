import { MessageType, SendToServer } from "./serverTypes";
import { UID } from "../state/stateTypes";

// should be kept in sync with `ClientEvents.kt`

export enum ServerEventTypes {
  Subscribe,
  Message,
  KeyPress,
  CreateGame,
}

export type AllServerEvents = [ServerEventTypes, unknown] &
  (SubscribeEvent | MessageEvent | KeyPressEvent | CreateGameEvent);
export type UpdateServerEvent = (event: AllServerEvents) => Promise<boolean>;
type UpdaterServerFunction<T extends AllServerEvents> = (
  sendToServer: SendToServer,
  payload: T[1]
) => Promise<boolean>;

// UpdateFunctions (Server)

type SubscribeEvent = [ServerEventTypes.Subscribe, UID];
export const subscribe: UpdaterServerFunction<SubscribeEvent> = (
  sendToServer,
  userId
) => {
  return sendToServer(MessageType.Subscribe, [userId]);
};

export enum Keys {
  ARROW_LEFT = "ArrowLeft",
  ARROW_RIGHT = "ArrowRight",
  ARROW_UP = "ArrowLeft",
  SPACE = "SPACE",
  KEY_E = "KeyE",
  KEY_Q = "KeyQ",
}

export function toKey(code: string): Keys {
  // To do mapping
  return Keys.ARROW_UP;
}

type MessageEvent = [ServerEventTypes.Message, string[]];
export const message: UpdaterServerFunction<MessageEvent> = (
  sendToServer,
  messages
) => {
  return sendToServer(MessageType.Message, messages);
};

type KeyPressEvent = [ServerEventTypes.KeyPress, Keys[]];
export const keyPress: UpdaterServerFunction<KeyPressEvent> = (
  sendToServer,
  keys
) => {
  return sendToServer(
    MessageType.KeyPress,
    keys.map((k) => k.toString())
  );
};

type CreateGameEvent = [ServerEventTypes.CreateGame, UID];
export const createGame: UpdaterServerFunction<CreateGameEvent> = (
  sendToServer,
  userId
) => {
  return sendToServer(MessageType.CreateGame, [userId]);
};
