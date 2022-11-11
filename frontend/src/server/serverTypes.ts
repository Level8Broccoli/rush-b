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
  createGame = "createGame",
}

export type SendToServer = (
  type: MessageType,
  data: string[]
) => Promise<boolean>;
