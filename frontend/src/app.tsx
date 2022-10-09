import { h } from "preact";
import { useEffect, useRef, useState } from "preact/compat";
import Canvas from "./components/canvas/Canvas";
import { Chat } from "./components/chat/Chat";
import webSocket from "./shared/websocket/websocket";
import { tileMapEnum } from "./shared/model/tileMap.enum";
import { isMessage } from "./shared/utils/parse";

export function App() {
  const socketRef = useRef(webSocket);
  const [messages, setMessages] = useState<String[]>([]);
  const [tileMap, setTileMap] = useState(tileMapEnum.ONE);
  const [character, setCharacter] = useState({
    id: "",
    color: "",
    x: -100,
    y: -100,
  });

  useEffect(() => {
    webSocket.onopen = function () {
      webSocket.send(
        JSON.stringify({
          type: "subscribe",
          data: String(Math.floor(Math.random() * 12)),
        })
      );
    };
    webSocket.onmessage = function (e: { data: string }) {
      const msg = JSON.parse(e.data) as unknown;
      if (!isMessage(msg)) {
        return;
      }
      if (msg["msgType"] === "message" || msg["msgType"] === "keyPress") {
        setMessages((prev) => [...prev, msg["data"]]);
      } else if (msg["msgType"] === "tileMap") {
        setTileMap(tileMapEnum[msg["data"] as keyof typeof tileMapEnum]);
      } else if (msg["msgType"] === "move") {
        setCharacter(JSON.parse(msg["data"]));
      }
    };
    webSocket.onclose = function () {};
  }, []);

  return (
    <>
      <h1>rush-b</h1>
      <Canvas socketRef={socketRef} tileMap={tileMap} character={character} />
      <Chat socketRef={socketRef} messages={messages} />
    </>
  );
}
