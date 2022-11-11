import { StateUpdater } from "preact/compat";
import { AppState, GameState, Message, Views } from "./stateTypes";
import { ConnectionStatus } from "../server/serverTypes";
import {
  Keys,
  ServerEventTypes,
  UpdateServerEvent,
} from "../server/serverEvents";

export enum Events {
  AddMessages,
  SendMessages,
  SendKeys,
  UpdateConnectionStatus,
  SetGame,
  GoToView,
  SearchForGame,
  StartNewGame,
}

export type AllStateEvents = [Events, unknown] &
  (
    | AddMessagesEvent
    | SendMessagesEvent
    | SendKeysEvent
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

type AddMessagesEvent = [Events.AddMessages, Message[]];

export const addMessages: UpdaterFunction<AddMessagesEvent> = (
  setState,
  updateServerEvent,
  messages
) => {
  setState((prevState) => {
    return { ...prevState, messages: [...prevState.messages, ...messages] };
  });
  return true;
};

type SendMessagesEvent = [Events.SendMessages, Message[]];

export const sendMessages: UpdaterFunction<SendMessagesEvent> = (
  setState,
  updateServerEvent,
  messages
) => {
  updateServerEvent([ServerEventTypes.Message, messages]);
  return true;
};

type SendKeysEvent = [Events.SendKeys, Keys[]];

export const sendKeys: UpdaterFunction<SendKeysEvent> = (
  setState,
  updateServerEvent,
  keys
) => {
  updateServerEvent([ServerEventTypes.KeyPress, keys]);
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
