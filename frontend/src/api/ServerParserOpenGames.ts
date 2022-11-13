import { ServerEvent } from "./ServerEventTypes";
import {
  hasProp,
  isArray,
  isNonNullObject,
  mapNonNull,
} from "../utils/parseUtils";
import { OpenGame, User } from "../state/stateTypes";

export function parseOpenGames(
  data: object,
  createOpenGamesServerEvent: (openGames: OpenGame[]) => ServerEvent
): ServerEvent | null {
  if (!isArray(data)) {
    return null;
  }
  const openGames: OpenGame[] = mapNonNull(data, parseOpenGame);
  return createOpenGamesServerEvent(openGames);
}

function parseOpenGame(d: unknown): OpenGame | null {
  if (!isNonNullObject(d)) {
    console.error(`OpenGame was expected to be a object: ${d}`);
    return null;
  }
  if (
    !(hasProp(d, "id") && hasProp(d, "creator") && hasProp(d, "secondPlayer"))
  ) {
    console.error(`Expected a id, creator and secondPlayer prop: ${d}`);
    return null;
  }
  const { id, creator, secondPlayer } = d;
  if (typeof id !== "string") {
    console.error(`Expected id prop to be of type string: ${id}`);
    return null;
  }
  const c = parseUser(creator);
  if (c === null) {
    console.error(`Couldn't parse creator: ${creator}`);
    return null;
  }
  if (!isNonNullObject(secondPlayer)) {
    if (secondPlayer === null) {
      return { id: { value: id }, creator: c };
    } else {
      console.error(
        `SecondPlayer was expected to be an object or null: ${secondPlayer}`
      );
      return null;
    }
  }
  const s = parseUser(secondPlayer);
  if (s === null) {
    console.error(`Couldn't parse secondPlayer: ${secondPlayer}`);
    return null;
  }
  return { id: { value: id }, creator: c, secondPlayer: s };
}

function parseUser(d: unknown): User | null {
  if (!isNonNullObject(d)) {
    console.error(`Data was expected to be a object: ${d}`);
    return null;
  }
  if (!(hasProp(d, "name") && hasProp(d, "id"))) {
    console.error(`Expected a id and name prop: ${d}`);
    return null;
  }
  const { id, name } = d;
  if (!(typeof id === "string" && typeof name === "string")) {
    console.error(`Expected id and name prop to be of type string: ${d}`);
    return null;
  }

  return { id: { value: id }, name };
}
