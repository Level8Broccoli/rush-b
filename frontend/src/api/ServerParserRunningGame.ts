import { ServerEvent } from "./ServerEventTypes";
import { GameState } from "../state/stateTypes";

export function parseRunningGame(
  _data: object,
  createRunningGameServerEvent: (gameState: GameState) => ServerEvent
): ServerEvent | null {
  return null;
  // const gameState = null;
  // return createRunningGameServerEvent(gameState);
}
