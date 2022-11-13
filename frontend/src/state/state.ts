import { StateUpdater, useState } from "preact/compat";
import {
  ConnectionStatus,
  MessageType,
  SendToServer,
} from "../api/ClientEventTypes";
import { AppState, Views } from "./stateTypes";
import {
  addMessages,
  GuiEvents,
  goToView,
  sendKeys,
  sendMessages,
  setGame,
  setUserId,
  startNewGame,
  startNewSession,
  updateConnectionStatus,
  UpdateGuiEvent,
  updateOpenGames,
} from "./stateEvents";
import { serverEvent } from "../api/server";
import { UpdateClientEvent } from "../api/ClientEvents";

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
  updateServerEvent: UpdateClientEvent
) => UpdateGuiEvent = (setState, updateServerEvent) => (event) => {
  const [eventType, payload] = event;
  switch (eventType) {
    case GuiEvents.StartNewSession:
      return startNewSession(setState, updateServerEvent, payload);
    case GuiEvents.AddMessages:
      return addMessages(setState, updateServerEvent, payload);
    case GuiEvents.SendMessages:
      return sendMessages(setState, updateServerEvent, payload);
    case GuiEvents.SendKeys:
      return sendKeys(setState, updateServerEvent, payload);
    case GuiEvents.UpdateConnectionStatus:
      return updateConnectionStatus(setState, updateServerEvent, payload);
    case GuiEvents.SetGame:
      return setGame(setState, updateServerEvent, payload);
    case GuiEvents.GoToView:
      return goToView(setState, updateServerEvent, payload);
    case GuiEvents.StartNewGame:
      return startNewGame(setState, updateServerEvent, payload);
    case GuiEvents.SetUserId:
      return setUserId(setState, updateServerEvent, payload);
    case GuiEvents.UpdateOpenGames:
      return updateOpenGames(setState, updateServerEvent, payload);
  }
};

export function useGameState(
  sendMessage: SendToServer
): [AppState, UpdateGuiEvent] {
  const [state, setState] = useState<AppState>(initalGameState);
  return [state, updateEvent(setState, serverEvent(sendMessage))];
}
