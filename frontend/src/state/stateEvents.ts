import { StateUpdater } from "preact/compat";
import { GameState, AppState, Message, Views } from "./stateTypes";
import { ConnectionStatus } from "../websocket/websocketTypes";

export enum Events {
  NewMessage,
  UpdateConnectionStatus,
  SetGame,
  GoToView,
  SearchForGame,
  StartNewGame,
}

export type AllEvents = [Events, unknown] &
  (
    | NewMessageEvent
    | UpdateConnectionStatusEvent
    | SetGameEvent
    | GoToViewEvent
    | SearchForGameEvent
    | StartNewGameEvent
  );

export type UpdateEvent = (event: AllEvents) => void;

type UpdaterFunction<T extends AllEvents> = (
  setState: StateUpdater<AppState>,
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

type SetGameEvent = [Events.SetGame, GameState];

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

type SearchForGameEvent = [Events.SearchForGame, string];

export const searchForGame: UpdaterFunction<SearchForGameEvent> = (
  setState,
  playerName
) => {
  setState((prevState) => {
    return { ...prevState, view: Views.Lobby, playerName };
  });
  return true;
};

type StartNewGameEvent = [Events.StartNewGame, string];

export const startNewGame: UpdaterFunction<StartNewGameEvent> = (
  setState,
  playerName
) => {
  setState((prevState) => {
    return { ...prevState, playerName, loadingMessage: "Spiel wird erstellt" };
  });
  return true;
};
