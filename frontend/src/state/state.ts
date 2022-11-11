import { StateUpdater, useState } from "preact/compat";
import { ConnectionStatus } from "../websocket/websocketTypes";
import { GameState, Views } from "./stateTypes";
import {
  AllEvents,
  Events,
  goToView,
  newMessage,
  searchForGame,
  setGame,
  startNewGame,
  updateConnectionStatus,
  UpdateEvent,
} from "./stateEvents";

const initalGameState: GameState = {
  view: Views.Home,
  connectionStatus: ConnectionStatus.CLOSED,
  messages: [],
  game: {
    level: { tiles: [[]] },
    timer: "",
    id: "",
    characters: [],
  },
  playerName: "",
  openGames: [
    { gameId: "hi", playerName: "hi" },
    { gameId: "hi", playerName: "h5" },
  ],
};

const updateEvent: (setState: StateUpdater<GameState>) => UpdateEvent =
  (setState: StateUpdater<GameState>) =>
  (event: AllEvents): true => {
    const [eventType, payload] = event;
    switch (eventType) {
      case Events.NewMessage:
        return newMessage(setState, payload);
      case Events.UpdateConnectionStatus:
        return updateConnectionStatus(setState, payload);
      case Events.SetGame:
        return setGame(setState, payload);
      case Events.GoToView:
        return goToView(setState, payload);
      case Events.SearchForGame:
        return searchForGame(setState, payload);
      case Events.StartNewGame:
        return startNewGame(setState, payload);
    }
  };

export function useGameState(): [GameState, UpdateEvent] {
  const [state, setState] = useState<GameState>(initalGameState);
  return [state, updateEvent(setState)];
}
