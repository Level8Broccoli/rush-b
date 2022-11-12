import { MessageType, SendToServer } from "./serverTypes";
import { UUID } from "../state/session";
import { User } from "../state/stateTypes";
import { StateUpdater } from "preact/compat";
import { initWebSocket } from "./server";
import { Events, UpdateEvent } from "../state/stateEvents";
import { isMessage } from "../utils/parse";

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

type SubscribeEvent = [
  ServerEventTypes.Subscribe,
  [User, UpdateEvent, StateUpdater<SendToServer>]
];
export const subscribe: UpdaterServerFunction<SubscribeEvent> = async (
  sendToServer,
  [user, updateEvent, setSend]
) => {
  await sendToServer(MessageType.Subscribe, [user.name, user.id.value]);
  const [sendMessage] = initWebSocket({
    onConnectionChange: (newStatus) =>
      updateEvent([Events.UpdateConnectionStatus, newStatus]),
    onMessageReceived: (data) => {
      if (!isMessage(data)) {
        return;
      }
      if (data["msgType"] === "message" || data["msgType"] === "keyPress") {
        updateEvent([Events.AddMessages, [data["data"]]]);
      } else if (data["msgType"] === "game") {
        const game = JSON.parse(data["data"]);
        game["level"] = JSON.parse(game["level"]);
        updateEvent([Events.SetGame, game]);
      }
    },
  });
  setSend(() => sendMessage);
  return new Promise((res) => res(true));
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

type CreateGameEvent = [ServerEventTypes.CreateGame, [UUID, string]];
export const createGame: UpdaterServerFunction<CreateGameEvent> = (
  sendToServer,
  [userId, userName]
) => {
  return sendToServer(MessageType.CreateGame, [userId.value, userName]);
};
