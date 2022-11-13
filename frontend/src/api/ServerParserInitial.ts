import { ServerEventTyp } from "./ServerEventTypes";
import { hasProp, isNonNullObject, safeParseJSON } from "../utils/parseUtils";

export function initialParser(payload: unknown): {
  type: ServerEventTyp;
  data: object;
} | null {
  if (payload === null || typeof payload !== "string") {
    console.error(`(1) Expected a string: ${payload}`);
    return null;
  }
  const parsed = safeParseJSON(payload);
  if (parsed === null) {
    console.error(`(2) String couldn't get parsed as JSON: ${payload}`);
    return null;
  }
  if (!isNonNullObject(parsed)) {
    console.error(`(3) Parsed JSON was expected to be an object: ${parsed}`);
    return null;
  }
  if (!(hasProp(parsed, "type") && hasProp(parsed, "data"))) {
    console.error(`(4) Expected a type and data prop: ${parsed}`);
    return null;
  }
  const { type, data } = parsed;
  if (!(typeof type === "string")) {
    console.error(`(5) Expected type prop to be of type string: ${type}`);
    return null;
  }
  const serverEventType = toEnumServerEventTyp(type);
  if (serverEventType === null) {
    console.error(
      `(6) Expected type prop to be of enum ServerEventTyp: ${type}`
    );
    return null;
  }
  if (typeof data !== "string") {
    console.error(`(7) Expected data prop to be of type string: ${type}`);
    return null;
  }
  const parsedData = safeParseJSON(data);
  if (parsedData === null) {
    console.error(`(8) String couldn't get parsed as JSON: ${data}`);
    return null;
  }
  if (!isNonNullObject(parsedData)) {
    console.error(
      `(9) Parsed JSON was expected to be an object: ${parsedData}`
    );
    return null;
  }
  return { type: serverEventType, data: parsedData };
}

function toEnumServerEventTyp(s: string): ServerEventTyp | null {
  switch (s) {
    case ServerEventTyp.RUNNING_GAME:
      return ServerEventTyp.RUNNING_GAME;
    case ServerEventTyp.MESSAGE:
      return ServerEventTyp.MESSAGE;
    case ServerEventTyp.OPEN_GAMES:
      return ServerEventTyp.OPEN_GAMES;
    case ServerEventTyp.SESSION_CLOSED:
      return ServerEventTyp.SESSION_CLOSED;
  }
  return null;
}
