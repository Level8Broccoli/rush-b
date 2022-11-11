import { SendMessage } from "./serverTypes";

export enum ServerEventTypes {
  KeyPress,
  CreateGame,
}

export type AllServerEvents = [ServerEventTypes, unknown] &
  (KeyPressEvent | CreateGameEvent);
export type UpdateServerEvent = (event: AllServerEvents) => Promise<true>;
type UpdaterServerFunction<T extends AllServerEvents> = (
  sendMessage: SendMessage,
  payload: T[1]
) => Promise<true>;

// UpdateFunctions (Server)

export enum Keys {
  DOWN,
}

type KeyPressEvent = [ServerEventTypes.KeyPress, Keys];
export const keyPress: UpdaterServerFunction<KeyPressEvent> = (
  sendMessage,
  key
) => {
  return new Promise(() => {});
};

type CreateGameEvent = [ServerEventTypes.CreateGame, string];
export const createGame: UpdaterServerFunction<CreateGameEvent> = (
  sendMessage,
  playerName
) => {
  return new Promise(() => {});
};
