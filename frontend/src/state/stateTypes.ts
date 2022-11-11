import { ConnectionStatus } from "../websocket/websocketTypes";
import { TileMap } from "./tileMap.enum";

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

export type Game = {
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

export type GameState = {
  view: Views;
  connectionStatus: ConnectionStatus;
  messages: Message[];
  game: Game;
  playerName: string;
};
