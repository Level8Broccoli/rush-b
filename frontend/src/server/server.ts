import SockJS from "sockjs-client/dist/sockjs";
import {
  ConnectionStatus,
  MessageType,
  Params,
  SendToServer,
} from "./serverTypes";
import {
  createGame,
  keyPress,
  message,
  ServerEventTypes,
  subscribe,
  UpdateServerEvent,
} from "./serverEvents";
import { UID } from "../state/stateTypes";

function generateUserId(): UID {
  return String(Math.floor(Math.random() * 9999));
}

function send(
  socket: WebSocket,
  type: MessageType,
  data: string[]
): Promise<boolean> {
  try {
    socket.send(JSON.stringify({ type, data }));
    return new Promise((resolve) => resolve(true));
  } catch (e) {
    return new Promise((_, reject) => reject(e));
  }
}

export function initWebSocket({
  onMessageReceived,
  onConnectionChange,
}: Params): [UID, SendToServer] {
  onConnectionChange(ConnectionStatus.CONNECTING);
  const userId = generateUserId();

  let sendMessage: SendToServer = (type, data) => {
    return new Promise(() =>
      console.error("Aktuell noch keine Verbindung aufgebaut", { type, data })
    );
  };

  function connect() {
    const webSocket = new SockJS(
      `${import.meta.env.DEV ? "//localhost:8080" : ""}/ws`
    );
    webSocket.onopen = function () {
      onConnectionChange(ConnectionStatus.OPEN);
      return send(webSocket, MessageType.Subscribe, [userId]);
    };
    webSocket.onmessage = function (e: { data: string }) {
      onMessageReceived(JSON.parse(e.data) as unknown);
    };
    webSocket.onclose = function () {
      onConnectionChange(ConnectionStatus.CLOSED);
      setTimeout(connect, Math.random() * 60_000);
    };

    sendMessage = function (
      type: MessageType,
      data: string[]
    ): Promise<boolean> {
      if (webSocket.readyState === ConnectionStatus.OPEN) {
        return send(webSocket, type, data);
      }
      return new Promise((_, reject) => reject("Connection is not open"));
    };
  }

  connect();

  return [userId, sendMessage];
}

export const serverEvent: (sendMessage: SendToServer) => UpdateServerEvent =
  (sendMessage) => (event) => {
    const [eventType, payload] = event;
    switch (eventType) {
      case ServerEventTypes.Subscribe:
        return subscribe(sendMessage, payload);
      case ServerEventTypes.Message:
        return message(sendMessage, payload);
      case ServerEventTypes.KeyPress:
        return keyPress(sendMessage, payload);
      case ServerEventTypes.CreateGame:
        return createGame(sendMessage, payload);
    }
  };
