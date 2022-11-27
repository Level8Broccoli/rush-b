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
  CreateOpenGame,
  DeleteOpenGame,
  JoinOpenGame,
  StartGameVsAi,
}

export type AllClientEvents = [ClientEventTypes, unknown] &
  (
    | SubscribeEvent
    | MessageEvent
    | KeyPressEvent
    | CreateOpenGameEvent
    | DeleteOpenGameEvent
    | JoinOpenGameEvent
    | StartGameVsAiEvent
  );
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

export const Keys = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "Space",
  "KeyE",
  "KeyQ",
];

type MessageEvent = [ClientEventTypes.Message, string[]];
export const message: UpdaterClientFunction<MessageEvent> = (
  server,
  messages
) => {
  return server.send(MessageType.Message, messages);
};

type KeyPressEvent = [ClientEventTypes.KeyPress, typeof Keys];
export const keyPress: UpdaterClientFunction<KeyPressEvent> = (
  server,
  keys
) => {
  return server.send(
    MessageType.KeyPress,
    keys.map((k) => k.toString())
  );
};

type CreateOpenGameEvent = [ClientEventTypes.CreateOpenGame, UUID];
export const createOpenGame: UpdaterClientFunction<CreateOpenGameEvent> = (
  server,
  gameId
) => {
  return server.send(MessageType.CreateOpenGame, [gameId.value]);
};

type DeleteOpenGameEvent = [ClientEventTypes.DeleteOpenGame, null];
export const deleteOpenGame: UpdaterClientFunction<DeleteOpenGameEvent> = (
  server
) => {
  return server.send(MessageType.DeleteOpenGame, []);
};

type JoinOpenGameEvent = [ClientEventTypes.JoinOpenGame, UUID];
export const joinOpenGame: UpdaterClientFunction<JoinOpenGameEvent> = (
  server,
  openGameId
) => {
  return server.send(MessageType.JoinOpenGame, [openGameId.value]);
};

type StartGameVsAiEvent = [ClientEventTypes.StartGameVsAi, null];
export const startGameVsAi: UpdaterClientFunction<StartGameVsAiEvent> = (
  server
) => {
  return server.send(MessageType.StartGameVsAi, []);
};
