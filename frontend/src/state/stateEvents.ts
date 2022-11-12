import { StateUpdater } from "preact/compat";
import { AppState, GameState, Message, User, Views } from "./stateTypes";
import { ConnectionStatus, SendToServer } from "../api/ClientEventTypes";
import { Keys, ClientEventTypes, UpdateClientEvent } from "../api/ClientEvents";
import { startNewSessionOnClient, UUID } from "./session";

export enum GuiEvents {
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

export type AllGuiStateEvents = [GuiEvents, unknown] &
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

export type UpdateGuiEvent = (event: AllGuiStateEvents) => true;

type UpdaterGuiFunction<T extends AllGuiStateEvents> = (
  setState: StateUpdater<AppState>,
  updateClientEvent: UpdateClientEvent,
  payload: T[1]
) => true;

// UpdaterFunctions

type StartNewSessionEvent = [
  GuiEvents.StartNewSession,
  [string, UpdateGuiEvent, StateUpdater<SendToServer>]
];

export const startNewSession: UpdaterGuiFunction<StartNewSessionEvent> = (
  setState,
  updateClientEvent,
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
  updateClientEvent([ClientEventTypes.Subscribe, [user, updateEvent, setSend]]);
  return true;
};

type AddMessagesEvent = [GuiEvents.AddMessages, Message[]];

export const addMessages: UpdaterGuiFunction<AddMessagesEvent> = (
  setState,
  updateClientEvent,
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

type SendMessagesEvent = [GuiEvents.SendMessages, Message[]];

export const sendMessages: UpdaterGuiFunction<SendMessagesEvent> = (
  setState,
  updateClientEvent,
  messages
) => {
  updateClientEvent([ClientEventTypes.Message, messages]);
  return true;
};

type SendKeysEvent = [GuiEvents.SendKeys, Keys[]];

export const sendKeys: UpdaterGuiFunction<SendKeysEvent> = (
  setState,
  updateClientEvent,
  keys
) => {
  updateClientEvent([ClientEventTypes.KeyPress, keys]);
  return true;
};

type UpdateConnectionStatusEvent = [
  GuiEvents.UpdateConnectionStatus,
  ConnectionStatus
];

export const updateConnectionStatus: UpdaterGuiFunction<
  UpdateConnectionStatusEvent
> = (setState, updateClientEvent, newStatus) => {
  setState(
    (prevState): AppState => ({ ...prevState, connectionStatus: newStatus })
  );
  return true;
};

type SetGameEvent = [GuiEvents.SetGame, GameState];

export const setGame: UpdaterGuiFunction<SetGameEvent> = (
  setState,
  updateClientEvent,
  game
) => {
  setState((prevState): AppState => ({ ...prevState, activeGame: game }));
  return true;
};

type GoToViewEvent = [GuiEvents.GoToView, Views];

export const goToView: UpdaterGuiFunction<GoToViewEvent> = (
  setState,
  updateClientEvent,
  view
) => {
  setState((prevState): AppState => ({ ...prevState, view }));
  return true;
};

type StartNewGameEvent = [GuiEvents.StartNewGame, UUID];

export const startNewGame: UpdaterGuiFunction<StartNewGameEvent> = (
  setState,
  updateClientEvent,
  userId
) => {
  // setState(
  //   (prevState): AppState => ({
  //     ...prevState,
  //     loadingMessage: "Spiel wird erstellt",
  //   })
  // );
  updateClientEvent([ClientEventTypes.CreateGame, userId]);
  return true;
};

type SetUserIdEvent = [GuiEvents.SetUserId, UUID];

export const setUserId: UpdaterGuiFunction<SetUserIdEvent> = (
  setState,
  updateClientEvent,
  userId
) => {
  setState((prevState): AppState => {
    return { ...prevState, user: { ...prevState.user, id: userId } };
  });
  return true;
};
