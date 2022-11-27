import {
  FinishedGameState,
  OpenGame,
  RunningGameState,
} from "../state/stateTypes";
import { GuiEvents, UpdateGuiEvent } from "../state/stateEvents";

export enum ServerEventTyp {
  OPEN_GAMES = "openGames",
  MESSAGE = "message",
  RUNNING_GAME = "runningGame",
  SESSION_CLOSED = "sessionClosed",
  FINISHED_GAME = "gameFinished",
}

export type ServerEvent = {
  execute(): void;
};

export const createFnOpenGamesServerEvent =
  (updateGuiEvent: UpdateGuiEvent) =>
  (openGames: OpenGame[]): ServerEvent => {
    return {
      execute() {
        updateGuiEvent([GuiEvents.UpdateOpenGames, openGames]);
      },
    };
  };

export const createFnRunningGameServerEvent =
  (updateGuiEvent: UpdateGuiEvent) =>
  (gameState: RunningGameState): ServerEvent => {
    return {
      execute() {
        updateGuiEvent([GuiEvents.SetGame, gameState]);
      },
    };
  };

export const createFnFinishGameServerEvent =
  (updateGuiEvent: UpdateGuiEvent) =>
  (gameState: FinishedGameState): ServerEvent => {
    return {
      execute() {
        updateGuiEvent([GuiEvents.FinishGame, gameState]);
      },
    };
  };
