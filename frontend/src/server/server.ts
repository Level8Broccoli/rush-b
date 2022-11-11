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

export function initWebSocket({
  onMessageReceived,
  onConnectionChange,
}: Params): SendToServer {
  onConnectionChange(ConnectionStatus.CONNECTING);

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
      webSocket.send(
        JSON.stringify({
          type: "subscribe",
          data: String(Math.floor(Math.random() * 12)),
        })
      );
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
        return new Promise((resolve) => {
          webSocket.send(JSON.stringify({ type, data }));
          resolve(true);
        });
      }
      return new Promise((reject) => reject(false));
    };
  }

  connect();

  return sendMessage;
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
