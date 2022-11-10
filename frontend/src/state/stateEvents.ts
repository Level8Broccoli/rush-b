import { StateUpdater } from "preact/compat";
import { Game, GameState, Message, Views } from "./stateTypes";
import { ConnectionStatus } from "../websocket/websocketTypes";

export enum Events {
  NewMessage,
  UpdateConnectionStatus,
  SetGame,
  GoToView,
}

export type AllEvents = [Events, unknown] &
  (
    | NewMessageEvent
    | UpdateConnectionStatusEvent
    | SetGameEvent
    | GoToViewEvent
  );

export type UpdateEvent = (event: AllEvents) => void;

type UpdaterFunction<T extends AllEvents> = (
  setState: StateUpdater<GameState>,
  payload: T[1]
) => true;

// UpdaterFunctions

type NewMessageEvent = [Events.NewMessage, Message];

export const newMessage: UpdaterFunction<NewMessageEvent> = (
  setState,
  newMessage
) => {
  setState((prevState) => {
    return { ...prevState, messages: [...prevState.messages, newMessage] };
  });
  return true;
};

type UpdateConnectionStatusEvent = [
  Events.UpdateConnectionStatus,
  ConnectionStatus
];

export const updateConnectionStatus: UpdaterFunction<
  UpdateConnectionStatusEvent
> = (setState, newStatus) => {
  setState((prevState) => {
    return { ...prevState, connectionStatus: newStatus };
  });
  return true;
};

type SetGameEvent = [Events.SetGame, Game];

export const setGame: UpdaterFunction<SetGameEvent> = (setState, game) => {
  setState((prevState) => {
    return { ...prevState, game };
  });
  return true;
};

type GoToViewEvent = [Events.GoToView, Views];

export const goToView: UpdaterFunction<GoToViewEvent> = (setState, view) => {
  setState((prevState) => {
    return { ...prevState, view };
  });
  return true;
};
