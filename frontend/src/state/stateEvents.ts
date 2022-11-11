import { StateUpdater } from "preact/compat";
import { AppState, GameState, Message, Views } from "./stateTypes";
import { ConnectionStatus } from "../websocket/websocketTypes";
import { ServerEventTypes, UpdateServerEvent } from "../websocket/serverEvents";

export enum Events {
  NewMessage,
  UpdateConnectionStatus,
  SetGame,
  GoToView,
  SearchForGame,
  StartNewGame,
}

export type AllStateEvents = [Events, unknown] &
  (
    | NewMessageEvent
    | UpdateConnectionStatusEvent
    | SetGameEvent
    | GoToViewEvent
    | SearchForGameEvent
    | StartNewGameEvent
  );

export type UpdateEvent = (event: AllStateEvents) => true;

type UpdaterFunction<T extends AllStateEvents> = (
  setState: StateUpdater<AppState>,
  updateServerEvent: UpdateServerEvent,
  payload: T[1]
) => true;

// UpdaterFunctions

type NewMessageEvent = [Events.NewMessage, Message];

export const newMessage: UpdaterFunction<NewMessageEvent> = (
  setState,
  updateServerEvent,
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
> = (setState, updateServerEvent, newStatus) => {
  setState((prevState) => {
    return { ...prevState, connectionStatus: newStatus };
  });
  return true;
};

type SetGameEvent = [Events.SetGame, GameState];

export const setGame: UpdaterFunction<SetGameEvent> = (
  setState,
  updateServerEvent,
  game
) => {
  setState((prevState) => {
    return { ...prevState, game };
  });
  return true;
};

type GoToViewEvent = [Events.GoToView, Views];

export const goToView: UpdaterFunction<GoToViewEvent> = (
  setState,
  updateServerEvent,
  view
) => {
  setState((prevState) => {
    return { ...prevState, view };
  });
  return true;
};

type SearchForGameEvent = [Events.SearchForGame, string];

export const searchForGame: UpdaterFunction<SearchForGameEvent> = (
  setState,
  updateServerEvent,
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
  updateServerEvent,
  playerName
) => {
  setState((prevState) => {
    return { ...prevState, playerName, loadingMessage: "Spiel wird erstellt" };
  });
  updateServerEvent([ServerEventTypes.CreateGame, playerName]);
  return true;
};
