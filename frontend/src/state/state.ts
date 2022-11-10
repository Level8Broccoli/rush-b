import { StateUpdater, useState } from "preact/compat";
import { ConnectionStatus } from "../websocket/websocketTypes";
import { GameState, Views } from "./stateTypes";
import {
  AllEvents,
  Events,
  goToView,
  newMessage,
  setGame,
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
    }
  };

export function useGameState(): [GameState, UpdateEvent] {
  const [state, setState] = useState<GameState>(initalGameState);
  return [state, updateEvent(setState)];
}
