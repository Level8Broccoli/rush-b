import { createRef, h } from "preact";
import { useEffect, useState } from "preact/compat";
import { SendMessage } from "../../shared/websocket/websocket";
import { drawSprite, SPRITES } from "./Sprite";

type Props = {
  send: SendMessage;
  tileMap: { tileSize: number; tiles: number[][] };
  character: {
    id: string;
    color: string;
    width: number;
    height: number;
    x: number;
    y: number;
    score: number;
    state: string;
    orientation: string;
  };
};

export default function Canvas(props: Props): JSX.Element {
  const [message, setMessage] = useState<string[]>([]);
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    const tileFactor = 0.5;
    const tileSize = props.tileMap.tileSize * tileFactor;
    if (ctx === null) {
      return;
    }

    props.tileMap.tiles.forEach((colElement, col) => {
      colElement.forEach((rowElement, row) => {
        const dx = col * tileSize;
        const dy = row * tileSize;
        const dWidth = tileSize;
        const dHeight = tileSize;
        if (props.tileMap.tiles[col][row] == 1) {
          //drawSprite(ctx, SPRITES.TERRAIN, dx, dy, dWidth, dHeight);
            ctx.fillStyle = "black";
            ctx.fillRect(dx,dy,dWidth,dHeight)
        } else {
          //drawSprite(ctx, SPRITES.BACKGROUND, dx, dy, dWidth, dHeight);
            ctx.fillStyle = "lightblue";
            ctx.fillRect(dx,dy,dWidth,dHeight)
        }
      });
    });
    const dx = props.character.x * tileFactor;
    const dy = props.character.y * tileFactor;
    const dWidth = props.character.width * tileFactor;
    const dHeight = props.character.height * tileFactor;
    //drawSprite(ctx, SPRITES.CHARACTER, dx, dy, dWidth, dHeight);
      ctx.fillStyle = props.character.color;
      ctx.fillRect(dx,dy,dWidth,dHeight)
  }, [props.character]);

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
    <canvas
      tabIndex={0}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      ref={canvasRef}
    />
  );
}
