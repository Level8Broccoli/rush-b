function hasProp<K extends PropertyKey>(
  data: object,
  prop: K
): data is Record<K, unknown> {
  return prop in data;
}

type Message = {
  msgType: string;
  data: string;
};

function isMessage(data: unknown): data is Message {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  if (!(hasProp(data, "msgType") && hasProp(data, "data"))) {
    return false;
  }
  return typeof data.msgType === "string" && typeof data.data === "string";
}

export { isMessage };
