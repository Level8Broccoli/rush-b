import { FinishedGameState, Player, User } from "../state/stateTypes";
import { ServerEvent } from "./ServerEventTypes";
import { hasProp, isNonNullObject } from "../utils/parseUtils";

export function parseFinishedGame(
  data: object,
  createFinishGameServerEvent: (gameState: FinishedGameState) => ServerEvent
): ServerEvent | null {
  if (
    !(
      hasProp(data, "id") &&
      hasProp(data, "player1") &&
      hasProp(data, "player2")
    )
  ) {
    console.error(`Expected a id, player1 and player2 prop: ${data}`);
    return null;
  }
  const { id, player1, player2 } = data;
  if (typeof id !== "string") {
    console.error(`Expected id prop to be of type string: ${id}`);
    return null;
  }
  if (!isNonNullObject(player1)) {
    console.error(`player1 was expected to be an object: ${player1}`);
    return null;
  }
  if (!isNonNullObject(player2)) {
    console.error(`player2 was expected to be an object: ${player2}`);
    return null;
  }
  const parsedPlayer1 = parsePlayer(player1);
  if (parsedPlayer1 === null) {
    return null;
  }
  const parsedPlayer2 = parsePlayer(player2);
  if (parsedPlayer2 === null) {
    return null;
  }
  const gameState: FinishedGameState = {
    id: { value: id },
    player1: parsedPlayer1,
    player2: parsedPlayer2,
  };
  return createFinishGameServerEvent(gameState);
}

function parsePlayer(e: object): Player | null {
  if (!hasProp(e, "score")) {
    `Expected a score prop: ${e}`;
    return null;
  }
  const { score } = e;
  if (typeof score !== "number") {
    console.error(`Expected score prop to be of type number: ${score}`);
    return null;
  }
  if (hasProp(e, "user") && isNonNullObject(e.user)) {
    const user = parseUser(e.user);
    return {
      score,
      user,
    };
  }
  return {
    score,
    user: null,
  };
}

function parseUser(e: object): User | null {
  if (!(hasProp(e, "name") && hasProp(e, "id"))) {
    `Expected a name and score prop: ${e}`;
    return null;
  }
  const { id, name } = e;
  if (typeof id !== "string") {
    console.error(`Expected id prop to be of type string: ${id}`);
    return null;
  }
  if (typeof name !== "string") {
    console.error(`Expected name prop to be of type string: ${name}`);
    return null;
  }
  return {
    id: { value: id },
    name,
  };
}
