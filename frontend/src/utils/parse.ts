export function hasProp<K extends PropertyKey>(
  data: object,
  prop: K
): data is Record<K, unknown> {
  return prop in data;
}

export function isArray(a: object): a is unknown[] {
  return Array.isArray(a);
}

export function isTypedArrayOf<T>(
  a: unknown[],
  validator: (e: unknown) => boolean
): a is T[] {
  return a.map(validator).find((e) => !e) !== false;
}

export function isNonNullObject(u: unknown): u is object {
  return typeof u === "object" && u !== null;
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
