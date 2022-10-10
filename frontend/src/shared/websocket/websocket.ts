import SockJS from "sockjs-client/dist/sockjs";

export enum ConnectionStatus {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

type Params = {
  onMessageReceived: (data: unknown) => void;
  onConnectionChange: (status: ConnectionStatus) => void;
};

type MessageType = "keyPress" | "message";

export type SendMessage = (type: MessageType, data: string | string[]) => void;

function initWebSocket({
  onMessageReceived,
  onConnectionChange,
}: Params): SendMessage {
  onConnectionChange(ConnectionStatus.CONNECTING);

  let sendMessage: SendMessage = (
    type: MessageType,
    data: string | string[]
  ) => {
    console.error("Aktuell noch keine Verbindung aufgebaut", { type, data });
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

    sendMessage = function (type: MessageType, data: string | string[]): void {
      if (webSocket.readyState === ConnectionStatus.OPEN)
        webSocket.send(JSON.stringify({ type, data }));
    };
  }

  connect();

  return sendMessage;
}

export { initWebSocket };
