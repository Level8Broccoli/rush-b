import { MessageType, SendToServer } from "./ClientEventTypes";
import { UUID } from "../state/session";
import { User } from "../state/stateTypes";
import { StateUpdater } from "preact/compat";
import { initWebSocket } from "./server";
import { GuiEvents, UpdateGuiEvent } from "../state/stateEvents";
import { parseFromServer } from "./ServerParser";

// should be kept in sync with `ClientEvents.kt`

export enum ClientEventTypes {
  Subscribe,
  Message,
  KeyPress,
  CreateGame,
}

export type AllClientEvents = [ClientEventTypes, unknown] &
  (SubscribeEvent | MessageEvent | KeyPressEvent | CreateGameEvent);
export type UpdateClientEvent = (event: AllClientEvents) => boolean;
type UpdaterClientFunction<T extends AllClientEvents> = (
  server: SendToServer,
  payload: T[1]
) => boolean;

// UpdateFunctions (Server)

type SubscribeEvent = [
  ClientEventTypes.Subscribe,
  [User, UpdateGuiEvent, StateUpdater<SendToServer>]
];
export const subscribe: UpdaterClientFunction<SubscribeEvent> = (
  server,
  [user, updateGuiEvent, setSend]
) => {
  const [sendMessage] = initWebSocket({
    onConnectionChange: (newStatus) =>
      updateGuiEvent([GuiEvents.UpdateConnectionStatus, newStatus]),
    onMessageReceived: (payload) => {
      const event = parseFromServer(updateGuiEvent, payload);
      if (event === null) {
        console.error(`Event couldn't get parsed. ${payload}`);
        console.log(payload);
        return;
      }
      event.execute();
    },
    getUser: () => {
      return user;
    },
  });
  setSend(() => sendMessage);
  return true;
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

type MessageEvent = [ClientEventTypes.Message, string[]];
export const message: UpdaterClientFunction<MessageEvent> = (
  server,
  messages
) => {
  return server.send(MessageType.Message, messages);
};

type KeyPressEvent = [ClientEventTypes.KeyPress, Keys[]];
export const keyPress: UpdaterClientFunction<KeyPressEvent> = (
  server,
  keys
) => {
  return server.send(
    MessageType.KeyPress,
    keys.map((k) => k.toString())
  );
};

type CreateGameEvent = [ClientEventTypes.CreateGame, UUID];
export const createGame: UpdaterClientFunction<CreateGameEvent> = (
  server,
  userId
) => {
  const gameId = crypto.randomUUID();
  return server.send(MessageType.CreateGame, [userId.value, gameId]);
};
