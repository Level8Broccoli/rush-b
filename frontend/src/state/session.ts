import { User } from "./stateTypes";
import { hasProp, isNonNullObject } from "../utils/parseUtils";

export type UUID = { value: string };

function generateUserId(): UUID {
  return { value: crypto.randomUUID() };
}

export function startNewSessionOnClient(userName: string): UUID {
  const userId: UUID = generateUserId();
  localStorage.setItem("user", JSON.stringify({ userName, userId }));
  return userId;
}

export function reconnectSession(): User | undefined {
  const user = localStorage.getItem("user");
  if (user === null) {
    return;
  }
  try {
    const data = JSON.parse(user) as unknown;
    if (
      isNonNullObject(data) &&
      hasProp(data, "userId") &&
      hasProp(data, "userName")
    ) {
      if (
        typeof data.userId === "string" &&
        typeof data.userName === "string"
      ) {
        return { id: { value: data.userId }, name: data.userName };
      }
    }
    return;
  } catch (_) {
    return;
  }
}
