import { ServerEvent, ServerEventTyp } from "./ServerEventTypes";
import { UpdateGuiEvent } from "../state/stateEvents";
import { hasProp, isNonNullObject } from "../utils/parseUtils";

function safeParseJSON(payload: string): unknown {
  try {
    return JSON.parse(payload) as unknown;
  } catch (e) {
    console.error(`Couldn't parse JSON: ${payload}, because ${e}`);
    return null;
  }
}

function toEnumServerEventTyp(s: string): ServerEventTyp | null {
  switch (s) {
    case ServerEventTyp.GAME:
      return ServerEventTyp.GAME;
    case ServerEventTyp.MESSAGE:
      return ServerEventTyp.MESSAGE;
    case ServerEventTyp.OPEN_GAMES:
      return ServerEventTyp.OPEN_GAMES;
    case ServerEventTyp.SESSION_CLOSED:
      return ServerEventTyp.SESSION_CLOSED;
  }
  return null;
}

function initialParser(payload: unknown): {
  type: ServerEventTyp;
  data: object;
} | null {
  if (payload === null || typeof payload !== "string") {
    return null;
  }
  const parsed = safeParseJSON(payload);
  if (parsed === null) {
    return null;
  }
  if (!isNonNullObject(parsed)) {
    return null;
  }
  if (!(hasProp(parsed, "type") && hasProp(parsed, "data"))) {
    return null;
  }
  const { type, data } = parsed;
  if (!(typeof type === "string")) {
    return null;
  }
  const serverEventType = toEnumServerEventTyp(type);
  if (serverEventType === null) {
    return null;
  }
  if (typeof data !== "string") {
    return null;
  }
  const parsedData = safeParseJSON(data);
  if (parsedData === null) {
    return null;
  }
  if (!isNonNullObject(parsedData)) {
    return null;
  }
  return { type: serverEventType, data: parsedData };
}

function parseMessage(_data: object): ServerEvent | null {
  return null;
}

function parseGame(_data: object): ServerEvent | null {
  return null;
}

function parseOpenGames(data: object): ServerEvent | null {
  console.log("open games");
  console.log(data);
  return null;
}

function parseSessionClosed(_data: object): ServerEvent | null {
  return null;
}

export function parseFromServer(
  updateEvent: UpdateGuiEvent,
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
      return parseOpenGames(data);
    case ServerEventTyp.SESSION_CLOSED:
      return parseSessionClosed(data);
  }
}
