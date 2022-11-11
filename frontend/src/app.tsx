import { h } from "preact";
import { useEffect, useState } from "preact/compat";
import { isMessage } from "./utils/parse";
import { useGameState } from "./state/state";
import { SendToServer } from "./server/serverTypes";
import { initWebSocket } from "./server/server";
import { Events } from "./state/stateEvents";
import { Router } from "./views/Router";
import { BaseLayout } from "./layouts/BaseLayout";

export function App() {
  const [send, setSend] = useState<SendToServer>(
    (type, data) =>
      new Promise(() =>
        console.error("not yet connected", {
          type,
          data,
        })
      )
  );
  const [state, updateEvent] = useGameState(send);

  useEffect(() => {
    const sendMessage = initWebSocket({
      onConnectionChange: (newStatus) =>
        updateEvent([Events.UpdateConnectionStatus, newStatus]),
      onMessageReceived: (data) => {
        if (!isMessage(data)) {
          return;
        }
        if (data["msgType"] === "message" || data["msgType"] === "keyPress") {
          updateEvent([Events.AddMessages, [data["data"]]]);
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
    <BaseLayout
      playerName={state.player.name}
      loadingMessage={state.loadingMessage}
      connectionStatus={state.connectionStatus}
    >
      <Router state={state} updateEvent={updateEvent} />
    </BaseLayout>
  );
}
