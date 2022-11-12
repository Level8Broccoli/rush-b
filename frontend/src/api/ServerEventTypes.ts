export enum ServerEventTyp {
  OPEN_GAMES = "openGames",
  MESSAGE = "message",
  GAME = "game",
  SESSION_CLOSED = "sessionClosed",
}

export type ServerEvent = {
  execute(): void;
};
