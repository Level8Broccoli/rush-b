import { StateUpdater, useState } from "preact/compat";
import { ConnectionStatus } from "../websocket/websocketTypes";
import { GameState } from "./stateTypes";
import {
  AllEvents,
  Events,
  newMessage,
  updateConnectionStatus,
  UpdateEvent,
} from "./stateEvents";

const initalGameState: GameState = {
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
  (event: AllEvents): void => {
    const [eventType, payload] = event;
    switch (eventType) {
      case Events.NewMessage:
        return newMessage(setState, payload);
      case Events.UpdateConnectionStatus:
        return updateConnectionStatus(setState, payload);
    }
  };

export function useGameState(): [GameState, UpdateEvent] {
  const [state, setState] = useState<GameState>(initalGameState);
  return [state, updateEvent(setState)];
}
