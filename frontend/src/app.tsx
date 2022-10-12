import { h } from "preact";
import { useEffect, useState } from "preact/compat";
import Canvas from "./components/canvas/Canvas";
import { Chat } from "./components/chat/Chat";
import {
  ConnectionStatus,
  initWebSocket,
  SendMessage,
} from "./shared/websocket/websocket";
import { tileMapEnum } from "./shared/model/tileMap.enum";
import { isMessage } from "./shared/utils/parse";
import Logs from "./components/log/Logs";

export function App() {
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.CLOSED
  );
  const [send, setSend] = useState<SendMessage>((type, data) =>
    console.error("not yet connected", { type, data })
  );
  const [messages, setMessages] = useState<string[]>([]);
  const [tileMap, setTileMap] = useState(tileMapEnum.ONE);
  const [character, setCharacter] = useState({
    id: "",
    color: "",
    width: 0,
    height: 0,
    x: -100,
    y: -100,
    score: 0,
    state: "",
    orientation: "",
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
        } else if (data["msgType"] === "tileMap") {
          setTileMap(tileMapEnum[data["data"] as keyof typeof tileMapEnum]);
        } else if (data["msgType"] === "move") {
          setCharacter(JSON.parse(data["data"]));
        }
      },
    });
    setSend(() => sendMessage);
  }, []);

  return (
    <div style="padding: 1rem;">
      <h1>rush-b</h1>
      <small><em>by Lena & Oliver</em></small>
      <div style="display: grid; grid-template-columns: 1fr 20rem; gap: 1rem; padding: 3rem;">
        <Canvas send={send} tileMap={tileMap} character={character} />
        <div style="background-color: lightgray; border-radius: 0.3rem; padding-inline: 1rem;">
          <Logs connectionStatus={connectionStatus} logs={messages} />
          <Chat send={send} />
        </div>
      </div>
    </div>
  );
}
