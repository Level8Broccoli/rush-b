import { StateUpdater, useState } from "preact/compat";
import { ConnectionStatus, SendToServer } from "../server/serverTypes";
import { AppState, Views } from "./stateTypes";
import {
  Events,
  goToView,
  addMessages,
  searchForGame,
  setGame,
  startNewGame,
  updateConnectionStatus,
  UpdateEvent,
  sendMessages,
  sendKeys,
} from "./stateEvents";
import { serverEvent } from "../server/server";
import { UpdateServerEvent } from "../server/serverEvents";

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
  player: { id: "", name: "" },
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
    case Events.SearchForGame:
      return searchForGame(setState, updateServerEvent, payload);
    case Events.StartNewGame:
      return startNewGame(setState, updateServerEvent, payload);
  }
};

export function useGameState(
  sendMessage: SendToServer
): [AppState, UpdateEvent] {
  const [state, setState] = useState<AppState>(initalGameState);
  return [state, updateEvent(setState, serverEvent(sendMessage))];
}
