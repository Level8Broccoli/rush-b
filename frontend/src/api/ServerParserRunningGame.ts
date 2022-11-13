import { ServerEvent } from "./ServerEventTypes";
import { Character, GameState } from "../state/stateTypes";
import {
  hasProp,
  isArray,
  isNonNullObject,
  isTypedArrayOf,
  safeParseJSON,
} from "../utils/parseUtils";

export function parseRunningGame(
  data: object,
  createRunningGameServerEvent: (gameState: GameState) => ServerEvent
): ServerEvent | null {
  if (
    !(
      hasProp(data, "id") &&
      hasProp(data, "timer") &&
      hasProp(data, "level") &&
      hasProp(data, "characters")
    )
  ) {
    console.error(`Expected a id, timer, level and characters prop: ${data}`);
    return null;
  }
  const { id, timer, level, characters } = data;
  if (typeof id !== "string") {
    console.error(`Expected id prop to be of type string: ${id}`);
    return null;
  }
  if (typeof timer !== "string") {
    console.error(`Expected timer prop to be of type string: ${timer}`);
    return null;
  }
  if (typeof level !== "string") {
    console.error(`Expected level prop to be of type string: ${level}`);
    return null;
  }
  const parsedLevel = safeParseJSON(level);
  if (parsedLevel === null) {
    console.error(`Level couldn't get parsed as JSON: ${level}`);
    return null;
  }
  if (!isNonNullObject(parsedLevel)) {
    console.error(`Level was expected to be an object: ${level}`);
    return null;
  }
  if (!isArray(parsedLevel)) {
    console.error(`Level was expected to be an array: ${level}`);
    return null;
  }
  if (!isTypedArrayOf<number[]>(parsedLevel, validateLevelRow)) {
    console.error(
      `Level was expected to be an array of arrays of type number: ${level}`
    );
    return null;
  }
  if (!isNonNullObject(characters)) {
    console.error(`Characters was expected to be an object: ${characters}`);
    return null;
  }
  if (!isArray(characters)) {
    console.error(`Characters was expected to be an array: ${characters}`);
    return null;
  }
  if (!isTypedArrayOf<Character>(characters, validateCharacter)) {
    return null;
  }
  const gameState: GameState = {
    id,
    characters,
    level: { tiles: parsedLevel },
    timer,
  };
  return createRunningGameServerEvent(gameState);
}

function validateLevelRow(e: unknown): boolean {
  if (!isNonNullObject(e)) {
    return false;
  }
  if (!isArray(e)) {
    return false;
  }
  return isTypedArrayOf<number>(e, validateLevelElement);
}

function validateLevelElement(e: unknown): boolean {
  return typeof e === "number";
}

function validateCharacter(e: unknown): boolean {
  if (!isNonNullObject(e)) {
    console.error(`Character was expected to be an object: ${e}`);
    return false;
  }
  if (
    !(
      hasProp(e, "id") &&
      hasProp(e, "color") &&
      hasProp(e, "width") &&
      hasProp(e, "height") &&
      hasProp(e, "x") &&
      hasProp(e, "y") &&
      hasProp(e, "state") &&
      hasProp(e, "orientation")
    )
  ) {
    console.error(
      `Expected a id, color, width, height, x, y, state and orientation prop: ${e}`
    );
    return false;
  }
  const { id, color, width, height, x, y, state, orientation } = e;
  if (typeof id !== "string") {
    console.error(`Expected id prop to be of type string: ${id}`);
    return false;
  }
  if (typeof color !== "string") {
    console.error(`Expected color prop to be of type string: ${color}`);
    return false;
  }
  if (typeof width !== "number") {
    console.error(`Expected width prop to be of type string: ${width}`);
    return false;
  }
  if (typeof height !== "number") {
    console.error(`Expected height prop to be of type string: ${height}`);
    return false;
  }
  if (typeof x !== "number") {
    console.error(`Expected x prop to be of type string: ${x}`);
    return false;
  }
  if (typeof y !== "number") {
    console.error(`Expected y prop to be of type string: ${y}`);
    return false;
  }
  if (typeof state !== "string") {
    console.error(`Expected state prop to be of type string: ${state}`);
    return false;
  }
  if (typeof orientation !== "string") {
    console.error(
      `Expected orientation prop to be of type string: ${orientation}`
    );
    return false;
  }
  return true;
}
