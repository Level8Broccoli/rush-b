import { hasProp } from "./parseUtils";

type Message = {
  msgType: string;
  data: string;
};

export function isMessage(data: unknown): data is Message {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  if (!(hasProp(data, "msgType") && hasProp(data, "data"))) {
    return false;
  }
  return typeof data.msgType === "string" && typeof data.data === "string";
}
