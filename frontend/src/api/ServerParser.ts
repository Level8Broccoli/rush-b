import {
  createFnFinishGameServerEvent,
  createFnOpenGamesServerEvent,
  createFnRunningGameServerEvent,
  ServerEvent,
  ServerEventTyp,
} from "./ServerEventTypes";
import { UpdateGuiEvent } from "../state/stateEvents";
import { parseOpenGames } from "./ServerParserOpenGames";
import { initialParser } from "./ServerParserInitial";
import { parseRunningGame } from "./ServerParserRunningGame";
import { parseFinishedGame } from "./ServerParseFinishedGame";

function parseMessage(_data: object): ServerEvent | null {
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
  console.log({ type, data });
  switch (type) {
    case ServerEventTyp.MESSAGE:
      return parseMessage(data);
    case ServerEventTyp.RUNNING_GAME:
      return parseRunningGame(
        data,
        createFnRunningGameServerEvent(updateGuiEvent)
      );
    case ServerEventTyp.OPEN_GAMES:
      return parseOpenGames(data, createFnOpenGamesServerEvent(updateGuiEvent));
    case ServerEventTyp.SESSION_CLOSED:
      return parseSessionClosed(data);
    case ServerEventTyp.FINISHED_GAME:
      return parseFinishedGame(
        data,
        createFnFinishGameServerEvent(updateGuiEvent)
      );
  }
}
