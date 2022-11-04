import Canvas, { CanvasContext } from "./Canvas";
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/compat";
import { drawBackground, drawCharacters } from "./draw";
import { Character } from "../../shared/model/GameTypes";
import { SendMessage } from "../../shared/websocket/websocket";

type Props = {
  timer: string;
  tileMap: number[][];
  characters: Character[];
  send: SendMessage;
};

export default function GameUI(props: Props): JSX.Element {
  console.log(props.timer)
  const contextRef = useRef<CanvasContext>();
  const [message, setMessage] = useState<string[]>([]);
  useEffect(() => {
    requestAnimationFrame(() => {
      if (contextRef.current === undefined) {
        return;
      }
      contextRef.current.clear();
      drawBackground(contextRef.current, props.tileMap, props.characters);
      drawCharacters(contextRef.current, props.characters);
    });
  }, [props.characters]);

  function getCtx(context: CanvasContext): void {
    contextRef.current = context;
  }

  const onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    if (!message.includes(e.code)) {
      setMessage((prev) => [...prev, e.code]);
    }
    if (message.length) {
      props.send("keyPress", message);
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    if (message.includes(e.code)) {
      setMessage((prev) => [...prev].filter((item) => item !== e.code));
    }
    if (message.length) {
      props.send("keyPress", message);
    }
  };

  return (
    <Canvas
      getCtx={getCtx}
      relHeight={props.tileMap[0].length}
      relWidth={props.tileMap.length}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
    />
  );
}
