import { StateUpdater } from "preact/compat";
import { AppState, GameState, Message, UID, Views } from "./stateTypes";
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
  SetUserId,
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
    | SetUserIdEvent
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
  setState(
    (prevState): AppState => ({
      ...prevState,
      messages: [...prevState.messages, ...messages],
    })
  );
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
  setState(
    (prevState): AppState => ({ ...prevState, connectionStatus: newStatus })
  );
  return true;
};

type SetGameEvent = [Events.SetGame, GameState];

export const setGame: UpdaterFunction<SetGameEvent> = (
  setState,
  updateServerEvent,
  game
) => {
  setState((prevState): AppState => ({ ...prevState, game }));
  return true;
};

type GoToViewEvent = [Events.GoToView, Views];

export const goToView: UpdaterFunction<GoToViewEvent> = (
  setState,
  updateServerEvent,
  view
) => {
  setState((prevState): AppState => ({ ...prevState, view }));
  return true;
};

type SearchForGameEvent = [Events.SearchForGame, string];

export const searchForGame: UpdaterFunction<SearchForGameEvent> = (
  setState,
  updateServerEvent,
  playerName
) => {
  setState(
    (prevState): AppState => ({
      ...prevState,
      view: Views.Lobby,
      player: { ...prevState.player, name: playerName },
    })
  );
  return true;
};

type StartNewGameEvent = [Events.StartNewGame, string];

export const startNewGame: UpdaterFunction<StartNewGameEvent> = (
  setState,
  updateServerEvent,
  playerName
) => {
  setState(
    (prevState): AppState => ({
      ...prevState,
      player: { ...prevState.player, name: playerName },
      loadingMessage: "Spiel wird erstellt",
    })
  );
  updateServerEvent([ServerEventTypes.CreateGame, playerName]);
  return true;
};

type SetUserIdEvent = [Events.SetUserId, UID];

export const setUserId: UpdaterFunction<SetUserIdEvent> = (
  setState,
  updateServerEvent,
  userId
) => {
  setState((prevState): AppState => {
    return { ...prevState, player: { ...prevState.player, id: userId } };
  });
  return true;
};
