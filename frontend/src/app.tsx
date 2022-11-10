import { h } from "preact";
import { useEffect, useState } from "preact/compat";
import { isMessage } from "./utils/parse";
import { Home } from "./views/Home";
import { Lobby } from "./views/Lobby";
import Logs from "./components/log/Logs";
import { Chat } from "./components/chat/Chat";
import { useGameState } from "./state/state";
import { SendMessage } from "./websocket/websocketTypes";
import { initWebSocket } from "./websocket/websocket";
import { Events } from "./state/stateEvents";

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
    <div>
      <div style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 1rem; padding: 0.5rem;">
        <h1 style="margin: 0;">rush-b</h1>
        <small>
          <em>by Lena & Oliver</em>
        </small>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 20rem; gap: 1rem; padding-block: 3rem;">
        <Home />
        <Lobby />
      </div>
      <div style="background-color: lightgray; border-radius: 0.3rem; padding-inline: 1rem;">
        <Logs connectionStatus={state.connectionStatus} logs={state.messages} />
        <Chat send={send} />
      </div>
    </div>
  );
}
