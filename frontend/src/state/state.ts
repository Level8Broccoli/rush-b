import { StateUpdater, useState } from "preact/compat";
import { ConnectionStatus, SendMessage } from "../websocket/websocketTypes";
import { AppState, Views } from "./stateTypes";
import {
  Events,
  goToView,
  newMessage,
  searchForGame,
  setGame,
  startNewGame,
  updateConnectionStatus,
  UpdateEvent,
} from "./stateEvents";
import { serverEvent } from "../websocket/websocket";
import { UpdateServerEvent } from "../websocket/serverEvents";

const initalGameState: AppState = {
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
  loadingMessage: "",
};

const updateEvent: (
  setState: StateUpdater<AppState>,
  updateServerEvent: UpdateServerEvent
) => UpdateEvent = (setState, updateServerEvent) => (event) => {
  const [eventType, payload] = event;
  switch (eventType) {
    case Events.NewMessage:
      return newMessage(setState, updateServerEvent, payload);
    case Events.UpdateConnectionStatus:
      return updateConnectionStatus(setState, updateServerEvent, payload);
    case Events.SetGame:
      return setGame(setState, updateServerEvent, payload);
    case Events.GoToView:
      return goToView(setState, updateServerEvent, payload);
    case Events.SearchForGame:
      return searchForGame(setState, updateServerEvent, payload);
    case Events.StartNewGame:
      return startNewGame(setState, updateServerEvent, payload);
  }
};

export function useGameState(
  sendMessage: SendMessage
): [AppState, UpdateEvent] {
  const [state, setState] = useState<AppState>(initalGameState);
  return [state, updateEvent(setState, serverEvent(sendMessage))];
}
