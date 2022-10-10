import { createRef, h } from "preact";
import { useEffect, useState } from "preact/compat";

type Props = {
  socketRef: { current: WebSocket };
  tileMap: { tileSize: number; tiles: number[][] };
  character: { id: string; color: string; width: number; height: number; x: number; y: number; score: number; state: string; orientation: string };
};

export default function Canvas(props: Props): JSX.Element {
  const [message, setMessage] = useState<String[]>([]);
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

    ctx.clearRect(0, 0, 800, 800);
    props.tileMap.tiles.forEach((colElement, col) => {
      colElement.forEach((rowElement, row) => {
        if (props.tileMap.tiles[col][row] == 1) {
          ctx.fillStyle = "black"; //randomColor;
          ctx.fillRect(
            col * tileSize,
            row * tileSize,
            tileSize,
            tileSize
          );
        } else {
          ctx.fillStyle = "white";
          ctx.fillRect(
            col * tileSize,
            row * tileSize,
            tileSize,
            tileSize
          );
        }
      });
    });
    ctx.fillStyle = props.character.color;
    ctx.fillRect(
      props.character.x * tileFactor,
      props.character.y * tileFactor,
      props.character.width * tileFactor,
        props.character.height * tileFactor
    );
  }, [props.character]);

  const onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    if (!message.includes(e.code)) {
      setMessage((prev) => [...prev, e.code]);
    }
    if (message.length) {
      props.socketRef.current.send(
        JSON.stringify({ type: "keyPress", data: message })
      );
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    if (message.includes(e.code)) {
      setMessage((prev) => [...prev].filter(item => item !== e.code));
    }
    if (message.length) {
      props.socketRef.current.send(
          JSON.stringify({ type: "keyPress", data: message })
      );
    }
  }

  return <canvas tabIndex={0} onKeyDown={onKeyDown} onKeyUp={onKeyUp} ref={canvasRef} />;
}
