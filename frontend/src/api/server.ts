import SockJS from "sockjs-client/dist/sockjs";
import {
  ConnectionStatus,
  MessageType,
  Params,
  SendToServer,
} from "./ClientEventTypes";
import {
  ClientEventTypes,
  createOpenGame,
  deleteOpenGame,
  joinOpenGame,
  keyPress,
  message,
  startGameVsAi,
  subscribe,
  UpdateClientEvent,
} from "./ClientEvents";

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
    webSocket.onmessage = function (payload) {
      onMessageReceived(payload.data);
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

export const serverEvent: (sendMessage: SendToServer) => UpdateClientEvent =
  (sendMessage) => (event) => {
    const [eventType, payload] = event;
    switch (eventType) {
      case ClientEventTypes.Subscribe:
        return subscribe(sendMessage, payload);
      case ClientEventTypes.Message:
        return message(sendMessage, payload);
      case ClientEventTypes.KeyPress:
        return keyPress(sendMessage, payload);
      case ClientEventTypes.CreateOpenGame:
        return createOpenGame(sendMessage, payload);
      case ClientEventTypes.DeleteOpenGame:
        return deleteOpenGame(sendMessage, payload);
      case ClientEventTypes.JoinOpenGame:
        return joinOpenGame(sendMessage, payload);
      case ClientEventTypes.StartGameVsAi:
        return startGameVsAi(sendMessage, payload);
    }
  };
