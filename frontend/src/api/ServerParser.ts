import {
  createFnOpenGamesServerEvent,
  ServerEvent,
  ServerEventTyp,
} from "./ServerEventTypes";
import { UpdateGuiEvent } from "../state/stateEvents";
import { parseOpenGames } from "./ServerParserOpenGames";
import { initialParser } from "./ServerParserInitial";

function parseMessage(_data: object): ServerEvent | null {
  return null;
}

function parseGame(_data: object): ServerEvent | null {
  return null;
}

function parseSessionClosed(_data: object): ServerEvent | null {
  return null;
}

export function parseFromServer(
  updateGuiEvent: UpdateGuiEvent,
  payload: unknown
): ServerEvent | null {
  const initialParsed = initialParser(payload);
  if (initialParsed === null) {
    return null;
  }
  const { type, data } = initialParsed;
  switch (type) {
    case ServerEventTyp.MESSAGE:
      return parseMessage(data);
    case ServerEventTyp.GAME:
      return parseGame(data);
    case ServerEventTyp.OPEN_GAMES:
      return parseOpenGames(data, createFnOpenGamesServerEvent(updateGuiEvent));
    case ServerEventTyp.SESSION_CLOSED:
      return parseSessionClosed(data);
  }
}