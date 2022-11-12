import { ConnectionStatus } from "../server/serverTypes";
import { TileMap } from "./tileMap.enum";

export type UID = string;

export type OpenGame = {
  playerName: string;
  gameId: UID;
};

export type Character = {
  id: string;
  paintId: number;
  color: string;
  width: number;
  height: number;
  x: number;
  y: number;
  score: number;
  state: string;
  orientation: string;
};

export type Message = string;

export type GameState = {
  id: string;
  timer: string;
  level: TileMap;
  characters: Character[];
};

export enum Views {
  Home,
  Lobby,
  Game,
}

export type Player = {
  name: string;
  id: UID;
};

export type AppState = {
  view: Views;
  connectionStatus: ConnectionStatus;
  messages: Message[];
  activeGame: GameState;
  player: Player;
  openGames: OpenGame[];
  loadingMessage: string;
};
