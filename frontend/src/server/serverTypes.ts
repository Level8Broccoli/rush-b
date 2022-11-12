export enum ConnectionStatus {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

export type Params = {
  onMessageReceived: (data: unknown) => void;
  onConnectionChange: (status: ConnectionStatus) => void;
};

export enum MessageType {
  Subscribe = "subscribe",
  KeyPress = "keyPress",
  Message = "message",
  CreateGame = "createGame",
}

export type SendToServer = {
  send: (type: MessageType, data: string[]) => boolean;
};
