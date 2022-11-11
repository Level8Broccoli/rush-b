import { h } from "preact";
import { useEffect, useState } from "preact/compat";
import { isMessage } from "./utils/parse";
import { useGameState } from "./state/state";
import { SendMessage } from "./websocket/websocketTypes";
import { initWebSocket } from "./websocket/websocket";
import { Events } from "./state/stateEvents";
import { Router } from "./views/Router";
import { BaseLayout } from "./layouts/BaseLayout";

export function App() {
  const [state, updateEvent] = useGameState();
  const [send, setSend] = useState<SendMessage>((type, data) =>
    console.error("not yet connected", { type, data })
  );

  useEffect(() => {
    const sendMessage = initWebSocket({
      onConnectionChange: (newStatus) =>
        updateEvent([Events.UpdateConnectionStatus, newStatus]),
      onMessageReceived: (data) => {
        if (!isMessage(data)) {
          return;
        }
        if (data["msgType"] === "message" || data["msgType"] === "keyPress") {
          updateEvent([Events.NewMessage, data["data"]]);
        } else if (data["msgType"] === "game") {
          const game = JSON.parse(data["data"]);
          game["level"] = JSON.parse(game["level"]);
          updateEvent([Events.SetGame, game]);
        }
      },
    });
    setSend(() => sendMessage);
  }, []);

  return (
    <BaseLayout>
      <Router state={state} updateEvent={updateEvent} send={send} />
    </BaseLayout>
  );
}
