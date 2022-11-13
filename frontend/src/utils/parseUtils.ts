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

export function mapNonNull<O, N>(
  list: O[],
  converter: (element: O) => N | null
): N[] {
  return list.flatMap((e) => {
    const converted = converter(e);
    return converted === null ? [] : [converted];
  });
}

export function safeParseJSON(payload: string): unknown {
  try {
    return JSON.parse(payload) as unknown;
  } catch (e) {
    console.error(`Couldn't parse JSON: ${payload}, because ${e}`);
    return null;
  }
}
