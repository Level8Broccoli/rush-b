import Canvas, { CanvasContext } from "./Canvas";
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/compat";
import { drawBackground, drawCharacters } from "./draw";
import { Character } from "../../state/stateTypes";
import { TileMap } from "../../state/tileMap.enum";
import { GuiEvents, UpdateGuiEvent } from "../../state/stateEvents";
import { Keys } from "../../api/ClientEvents";
import classes from "./GameUI.module.css";

type Props = {
  timer: string;
  tileMap: TileMap;
  characters: Character[];
  updateGuiEvent: UpdateGuiEvent;
};

export function GameUI(props: Props): JSX.Element {
  const contextRef = useRef<CanvasContext>();
  const [message, setMessage] = useState<typeof Keys>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    requestAnimationFrame(async () => {
      if (contextRef.current === undefined) {
        return;
      }
      counterRef.current += 1;
      contextRef.current.clear();
      drawBackground(contextRef.current, props.tileMap.tiles, props.characters);
      await drawCharacters(
        contextRef.current,
        props.characters,
        counterRef.current
      );
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
      props.updateGuiEvent([GuiEvents.SendKeys, message]);
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    if (message.includes(e.code)) {
      setMessage((prev) => [...prev].filter((item) => item !== e.code));
    }
    if (message.length) {
      props.updateGuiEvent([GuiEvents.SendKeys, message]);
    }
  };

  return (
    <section class={classes.ui}>
      <Canvas
        getCtx={getCtx}
        relHeight={props.tileMap.tiles[0].length}
        relWidth={props.tileMap.tiles.length}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
      />
      <footer class={classes.uiFooter}>
        {props.characters[0] && (
          <span class="has-text-light px-3 py-1">
            {props.characters[0].score}
          </span>
        )}
        <span class="has-text-light px-3 py-1">{props.timer}</span>
        {props.characters[1] && (
          <span class="has-text-light px-3 py-1">
            {props.characters[1].score}
          </span>
        )}
      </footer>
    </section>
  );
}
