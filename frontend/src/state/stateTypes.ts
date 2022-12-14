import { ConnectionStatus } from "../api/ClientEventTypes";
import { TileMap } from "./tileMap.enum";
import { UUID } from "./session";
import { SpriteType } from "../components/canvas/Sprite";

export type OpenGame = {
  id: UUID;
  creator: User;
  secondPlayer?: User;
};

export type Character = {
  id: SpriteType;
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

export type Player = {
  score: number;
  user: User | null;
};

export type FinishedGameState = {
  id: UUID;
  player1: Player;
  player2: Player;
};

export type RunningGameState = {
  id: UUID;
  timer: string;
  level: TileMap;
  characters: Character[];
};

export enum Views {
  Home,
  Lobby,
  YourGame,
  Game,
  JoinedGame,
  FinishedGame,
}

export type User = {
  name: string;
  id: UUID;
};

export type AppState = {
  view: Views;
  connectionStatus: ConnectionStatus;
  messages: Message[];
  activeGame: RunningGameState | null;
  finishedGame: FinishedGameState | null;
  user: User;
  openGames: OpenGame[];
  currentOpenGameId?: UUID;
  loadingMessage: string;
};
