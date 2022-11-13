import Canvas, { CanvasContext } from "./Canvas";
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/compat";
import { drawBackground, drawCharacters } from "./draw";
import { Character } from "../../state/stateTypes";
import { TileMap } from "../../state/tileMap.enum";
import { GuiEvents, UpdateGuiEvent } from "../../state/stateEvents";
import { Keys, toKey } from "../../api/ClientEvents";

type Props = {
  timer: string;
  tileMap: TileMap;
  characters: Character[];
  updateGuiEvent: UpdateGuiEvent;
};

export function GameUI(props: Props): JSX.Element {
  const contextRef = useRef<CanvasContext>();
  const [message, setMessage] = useState<Keys[]>([]);
  useEffect(() => {
    requestAnimationFrame(async () => {
      if (contextRef.current === undefined) {
        return;
      }

      contextRef.current.clear();
      drawBackground(contextRef.current, props.tileMap.tiles, props.characters);
      await drawCharacters(contextRef.current, props.characters);
      const ctx = contextRef.current.ctx;

      const text = props.timer;
      ctx.fillStyle = "white";
      ctx.font = "30px Arial";
      ctx?.fillText(text, 20, 40);
      ctx.fillStyle = "black";
      ctx.strokeText(text, 20, 40);
    });
  }, [props.characters]);

  function getCtx(context: CanvasContext): void {
    contextRef.current = context;
  }

  const onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    const key = toKey(e.code);
    if (!message.includes(key)) {
      setMessage((prev) => [...prev, key]);
    }
    if (message.length) {
      props.updateGuiEvent([GuiEvents.SendKeys, message]);
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    const key = toKey(e.code);
    if (message.includes(key)) {
      setMessage((prev) => [...prev].filter((item) => item !== key));
    }
    if (message.length) {
      props.updateGuiEvent([GuiEvents.SendKeys, message]);
    }
  };

  return (
    <Canvas
      getCtx={getCtx}
      relHeight={props.tileMap.tiles[0].length}
      relWidth={props.tileMap.tiles.length}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
    />
  );
}
