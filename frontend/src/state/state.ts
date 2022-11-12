import { StateUpdater, useState } from "preact/compat";
import {
  ConnectionStatus,
  MessageType,
  SendToServer,
} from "../api/ClientEventTypes";
import { AppState, Views } from "./stateTypes";
import {
  addMessages,
  Events,
  goToView,
  sendKeys,
  sendMessages,
  setGame,
  setUserId,
  startNewGame,
  startNewSession,
  updateConnectionStatus,
  UpdateEvent,
} from "./stateEvents";
import { serverEvent } from "../api/server";
import { UpdateServerEvent } from "../api/ClientEvents";

const initalGameState: AppState = {
  view: Views.Home,
  connectionStatus: ConnectionStatus.CLOSED,
  messages: [],
  activeGame: {
    level: { tiles: [[]] },
    timer: "",
    id: "",
    characters: [],
  },
  user: { id: { value: "" }, name: "" },
  openGames: [],
  loadingMessage: "",
};

const updateEvent: (
  setState: StateUpdater<AppState>,
  updateServerEvent: UpdateServerEvent
) => UpdateEvent = (setState, updateServerEvent) => (event) => {
  const [eventType, payload] = event;
  switch (eventType) {
    case Events.StartNewSession:
      return startNewSession(setState, updateServerEvent, payload);
    case Events.AddMessages:
      return addMessages(setState, updateServerEvent, payload);
    case Events.SendMessages:
      return sendMessages(setState, updateServerEvent, payload);
    case Events.SendKeys:
      return sendKeys(setState, updateServerEvent, payload);
    case Events.UpdateConnectionStatus:
      return updateConnectionStatus(setState, updateServerEvent, payload);
    case Events.SetGame:
      return setGame(setState, updateServerEvent, payload);
    case Events.GoToView:
      return goToView(setState, updateServerEvent, payload);
    case Events.StartNewGame:
      return startNewGame(setState, updateServerEvent, payload);
    case Events.SetUserId:
      return setUserId(setState, updateServerEvent, payload);
  }
};

export function useGameState(
  sendMessage: SendToServer
): [AppState, UpdateEvent] {
  const [state, setState] = useState<AppState>(initalGameState);
  return [state, updateEvent(setState, serverEvent(sendMessage))];
}
