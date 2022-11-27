import { StateUpdater } from "preact/compat";
import {
  AppState,
  RunningGameState,
  Message,
  OpenGame,
  User,
  Views,
  FinishedGameState,
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
  StartGameVsAi,
  StartGameVsPlayer,
  FinishGame,
  DeleteFinishedGame,
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
    | StartGameVsAiEvent
    | StartGameVsPlayerEvent
    | FinishGameEvent
    | DeleteFinishGameEvent
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

type SendKeysEvent = [GuiEvents.SendKeys, typeof Keys];
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

type SetGameEvent = [GuiEvents.SetGame, RunningGameState];
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
  setState(
    (prevState): AppState => ({
      ...prevState,
      currentOpenGameId: openGameId,
    })
  );
  updateClientEvent([ClientEventTypes.JoinOpenGame, openGameId]);
  return true;
};

type StartGameVsAiEvent = [GuiEvents.StartGameVsAi, null];
export const startGameVsAi: UpdaterGuiFunction<StartGameVsPlayerEvent> = (
  setState,
  updateClientEvent
) => {
  updateClientEvent([ClientEventTypes.StartGameVsAi, null]);
  return true;
};

type StartGameVsPlayerEvent = [GuiEvents.StartGameVsPlayer, null];
export const startGameVsPlayer: UpdaterGuiFunction<StartGameVsPlayerEvent> = (
  setState,
  updateClientEvent
) => {
  updateClientEvent([ClientEventTypes.StartGameVsPlayer, null]);
  return true;
};

type FinishGameEvent = [GuiEvents.FinishGame, FinishedGameState];
export const finishGame: UpdaterGuiFunction<FinishGameEvent> = (
  setState,
  updateClientEvent,
  game
) => {
  setState((prevState): AppState => {
    if (prevState.activeGame?.id.value === game.id.value) {
      return {
        ...prevState,
        finishedGame: game,
        activeGame: null,
        view:
          prevState.view === Views.Game ? Views.FinishedGame : prevState.view,
      };
    }
    return prevState;
  });
  return true;
};

type DeleteFinishGameEvent = [GuiEvents.DeleteFinishedGame, null];
export const deleteFinishGame: UpdaterGuiFunction<DeleteFinishGameEvent> = (
  setState
) => {
  setState(
    (prevState): AppState => ({
      ...prevState,
      finishedGame: null,
    })
  );
  return true;
};
