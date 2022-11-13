import { StateUpdater } from "preact/compat";
import {
  AppState,
  GameState,
  Message,
  OpenGame,
  User,
  Views,
} from "./stateTypes";
import { ConnectionStatus, SendToServer } from "../api/ClientEventTypes";
import { ClientEventTypes, Keys, UpdateClientEvent } from "../api/ClientEvents";
import { startNewSessionOnClient, UUID } from "./session";

export enum GuiEvents {
  StartNewSession,
  AddMessages,
  SendMessages,
  SendKeys,
  UpdateConnectionStatus,
  SetGame,
  GoToView,
  CreateOpenGame,
  SetUserId,
  UpdateOpenGames,
  DeleteOpenGame,
  JoinOpenGame,
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
    | CreateOpenGameEvent
    | SetUserIdEvent
    | UpdateOpenGamesEvent
    | DeleteOpenGameEvent
    | JoinOpenGameEvent
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

type CreateOpenGameEvent = [GuiEvents.CreateOpenGame, null];

export const createOpenGame: UpdaterGuiFunction<CreateOpenGameEvent> = (
  setState,
  updateClientEvent
) => {
  const gameId: UUID = { value: crypto.randomUUID() };
  setState(
    (prevState): AppState => ({
      ...prevState,
      currentOpenGameId: gameId,
    })
  );
  updateClientEvent([ClientEventTypes.CreateOpenGame, gameId]);
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

type UpdateOpenGamesEvent = [GuiEvents.UpdateOpenGames, OpenGame[]];

export const updateOpenGames: UpdaterGuiFunction<UpdateOpenGamesEvent> = (
  setState,
  updateClientEvent,
  openGames
) => {
  setState((prevState): AppState => ({ ...prevState, openGames }));
  return true;
};

type DeleteOpenGameEvent = [GuiEvents.DeleteOpenGame, null];

export const deleteOpenGame: UpdaterGuiFunction<DeleteOpenGameEvent> = (
  setState,
  updateClientEvent
) => {
  setState(
    (prevState): AppState => ({ ...prevState, currentOpenGameId: undefined })
  );
  updateClientEvent([ClientEventTypes.DeleteOpenGame, null]);
  return true;
};

type JoinOpenGameEvent = [GuiEvents.JoinOpenGame, UUID];

export const joinOpenGame: UpdaterGuiFunction<JoinOpenGameEvent> = (
  setState,
  updateClientEvent,
  openGameId
) => {
  updateClientEvent([ClientEventTypes.JoinOpenGame, openGameId]);
  return true;
};
