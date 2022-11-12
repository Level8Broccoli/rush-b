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

function send(socket: WebSocket, type: MessageType, data: string[]): boolean {
  try {
    socket.send(JSON.stringify({ type, data }));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function initWebSocket({
  onMessageReceived,
  onConnectionChange,
  getUser,
}: Params): [SendToServer] {
  onConnectionChange(ConnectionStatus.CONNECTING);
  let sendMessage: SendToServer = {
    send: () => {
      throw new Error(
        "Es konnte keine Verbindung zum Server aufgebaut werden",
        ...arguments
      );
    },
  };

  function connect() {
    const webSocket = new SockJS(
      `${import.meta.env.DEV ? "//localhost:8080" : ""}/ws`
    );
    webSocket.onopen = function () {
      onConnectionChange(ConnectionStatus.OPEN);
      const user = getUser();
      send(webSocket, MessageType.Subscribe, [user.id.value, user.name]);
    };
    webSocket.onmessage = function (e: { data: string }) {
      onMessageReceived(JSON.parse(e.data) as unknown);
    };
    webSocket.onclose = function () {
      onConnectionChange(ConnectionStatus.CLOSED);
      setTimeout(connect, Math.random() * 60_000);
    };

    sendMessage = {
      send(type: MessageType, data: string[]): boolean {
        if (webSocket.readyState === ConnectionStatus.OPEN) {
          return send(webSocket, type, data);
        }
        return false;
      },
    };
  }

  connect();

  return [sendMessage];
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
