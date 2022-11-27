import { StateUpdater, useState } from "preact/compat";
import { ConnectionStatus, SendToServer } from "../api/ClientEventTypes";
import { AppState, Views } from "./stateTypes";
import {
  addMessages,
  createOpenGame,
  deleteFinishGame,
  deleteOpenGame,
  finishGame,
  goToView,
  GuiEvents,
  joinOpenGame,
  sendKeys,
  sendMessages,
  setGame,
  setUserId,
  startGameVsAi,
  startNewSession,
  updateConnectionStatus,
  UpdateGuiEvent,
  updateOpenGames,
} from "./stateEvents";
import { serverEvent } from "../api/server";
import { UpdateClientEvent } from "../api/ClientEvents";

const initalGameState: AppState = {
  finishedGame: null,
  view: Views.Home,
  connectionStatus: ConnectionStatus.CLOSED,
  messages: [],
  activeGame: null,
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
    case GuiEvents.CreateOpenGame:
      return createOpenGame(setState, updateServerEvent, payload);
    case GuiEvents.SetUserId:
      return setUserId(setState, updateServerEvent, payload);
    case GuiEvents.UpdateOpenGames:
      return updateOpenGames(setState, updateServerEvent, payload);
    case GuiEvents.DeleteOpenGame:
      return deleteOpenGame(setState, updateServerEvent, payload);
    case GuiEvents.JoinOpenGame:
      return joinOpenGame(setState, updateServerEvent, payload);
    case GuiEvents.StartGameVsAi:
      return startGameVsAi(setState, updateServerEvent, payload);
    case GuiEvents.FinishGame:
      return finishGame(setState, updateServerEvent, payload);
    case GuiEvents.DeleteFinishedGame:
      return deleteFinishGame(setState, updateServerEvent, payload);
  }
};

export function useGameState(
  sendMessage: SendToServer
): [AppState, UpdateGuiEvent] {
  const [state, setState] = useState<AppState>(initalGameState);
  return [state, updateEvent(setState, serverEvent(sendMessage))];
}
