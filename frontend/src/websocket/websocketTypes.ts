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

export type MessageType = "keyPress" | "message";

export type SendMessage = (type: MessageType, data: string | string[]) => void;
