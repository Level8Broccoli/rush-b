import { OpenGame } from "../state/stateTypes";
import { GuiEvents, UpdateGuiEvent } from "../state/stateEvents";

export enum ServerEventTyp {
  OPEN_GAMES = "openGames",
  MESSAGE = "message",
  RUNNING_GAME = "runningGame",
  SESSION_CLOSED = "sessionClosed",
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
