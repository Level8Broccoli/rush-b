import { StateUpdater } from "preact/compat";
import { AppState, GameState, Message, User, Views } from "./stateTypes";
import { ConnectionStatus, SendToServer } from "../api/ClientEventTypes";
import { Keys, ServerEventTypes, UpdateServerEvent } from "../api/ClientEvents";
import { startNewSessionOnClient, UUID } from "./session";

export enum Events {
  StartNewSession,
  AddMessages,
  SendMessages,
  SendKeys,
  UpdateConnectionStatus,
  SetGame,
  GoToView,
  StartNewGame,
  SetUserId,
}

export type AllStateEvents = [Events, unknown] &
  (
    | StartNewSessionEvent
    | AddMessagesEvent
    | SendMessagesEvent
    | SendKeysEvent
    | UpdateConnectionStatusEvent
    | SetGameEvent
    | GoToViewEvent
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

type StartNewSessionEvent = [
  Events.StartNewSession,
  [string, UpdateEvent, StateUpdater<SendToServer>]
];

export const startNewSession: UpdaterFunction<StartNewSessionEvent> = (
  setState,
  updateServerEvent,
  [userName, updateEvent, setSend]
) => {
  const userId = startNewSessionOnClient(userName);
  const user: User = { id: userId, name: userName };
  setState(
    (prevState): AppState => ({
      ...prevState,
      user,
    })
  );
  updateServerEvent([ServerEventTypes.Subscribe, [user, updateEvent, setSend]]);
  return true;
};

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
  setState((prevState): AppState => ({ ...prevState, activeGame: game }));
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

type StartNewGameEvent = [Events.StartNewGame, UUID];

export const startNewGame: UpdaterFunction<StartNewGameEvent> = (
  setState,
  updateServerEvent,
  userId
) => {
  // setState(
  //   (prevState): AppState => ({
  //     ...prevState,
  //     loadingMessage: "Spiel wird erstellt",
  //   })
  // );
  updateServerEvent([ServerEventTypes.CreateGame, userId]);
  return true;
};

type SetUserIdEvent = [Events.SetUserId, UUID];

export const setUserId: UpdaterFunction<SetUserIdEvent> = (
  setState,
  updateServerEvent,
  userId
) => {
  setState((prevState): AppState => {
    return { ...prevState, user: { ...prevState.user, id: userId } };
  });
  return true;
};
