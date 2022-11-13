import { User } from "../state/stateTypes";

export enum ConnectionStatus {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

export type Params = {
  onMessageReceived: (payload: unknown) => void;
  onConnectionChange: (status: ConnectionStatus) => void;
  getUser: () => User;
};

export enum MessageType {
  Subscribe = "subscribe",
  KeyPress = "keyPress",
  Message = "message",
  CreateGame = "createGame",
  DeleteOpenGame = "deleteOpenGame",
}

export type SendToServer = {
  send: (type: MessageType, data: string[]) => boolean;
};
