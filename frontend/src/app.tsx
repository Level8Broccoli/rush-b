import { h } from "preact";
import { useEffect, useState } from "preact/compat";
import { Chat } from "./components/chat/Chat";
import {
  ConnectionStatus,
  initWebSocket,
  SendMessage,
} from "./shared/websocket/websocket";
import { tileMapEnum } from "./shared/model/tileMap.enum";
import { isMessage } from "./shared/utils/parse";
import Logs from "./components/log/Logs";
import GameUI from "./components/canvas/GameUI";

export function App() {
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.CLOSED
  );
  const [send, setSend] = useState<SendMessage>((type, data) =>
    console.error("not yet connected", { type, data })
  );
  const [messages, setMessages] = useState<string[]>([]);
  const [game, setGame] = useState({
    id: "",
    timer: "",
    level: [[]],
    characters: [
      {
        id: "",
        paintId: -1,
        color: "",
        width: 0,
        height: 0,
        x: -100,
        y: -100,
        score: 0,
        state: "",
        orientation: "",
      },
    ],
  });

  useEffect(() => {
    const sendMessage = initWebSocket({
      onConnectionChange: setConnectionStatus,
      onMessageReceived: (data) => {
        if (!isMessage(data)) {
          return;
        }
        if (data["msgType"] === "message" || data["msgType"] === "keyPress") {
          setMessages((prev) => [...prev, data["data"]]);
        } else if (data["msgType"] === "game") {
          const game = JSON.parse(data["data"]);
          game["level"] = JSON.parse(game["level"])
          console.log("timer: " + game["timer"])    // TODO: display timer on gui
          setGame(game);
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
        <GameUI
          timer={game.timer}
          tileMap={game.level}
          characters={game.characters}
          send={send}
        />
        <div style="background-color: lightgray; border-radius: 0.3rem; padding-inline: 1rem;">
          <Logs connectionStatus={connectionStatus} logs={messages} />
          <Chat send={send} />
        </div>
      </div>
    </div>
  );
}
