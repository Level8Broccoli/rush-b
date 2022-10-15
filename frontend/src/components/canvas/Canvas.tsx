import { createRef, h } from "preact";
import { useEffect, useState } from "preact/compat";

function createContext(ctx: CanvasRenderingContext2D, scaleFactor: number) {
  return {
    ctx,
    scale: (input: number) => input * scaleFactor,
    clear: () => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height),
  };
}

export type CanvasContext = ReturnType<typeof createContext>;

type Props = {
  getCtx: (context: CanvasContext) => void;
  relHeight: number;
  relWidth: number;
  onKeyDown: (e: KeyboardEvent) => void;
  onKeyUp: (e: KeyboardEvent) => void;
};

function getAspectRatio(
  horizontalUnits: number,
  verticalUnits: number
): number {
  return verticalUnits / horizontalUnits;
}

// setup for high res screens
const CANVAS_SCALE = 2;
const CANVAS_WIDTH = 1000;

export default function Canvas(props: Props): JSX.Element {
  const [WIDTH, _setWIDTH] = useState(CANVAS_WIDTH);
  const [HEIGHT, setHEIGHT] = useState(0);
  const canvas = createRef<HTMLCanvasElement>();

  useEffect(() => {
    setHEIGHT(WIDTH * getAspectRatio(props.relWidth, props.relHeight));
  }, [props.relWidth, props.relHeight]);

  useEffect(() => {
    if (canvas.current === null) {
      throw new Error("Couldn't get canvas");
    }
    canvas.current.width = WIDTH * CANVAS_SCALE;
    canvas.current.height = HEIGHT * CANVAS_SCALE;
    canvas.current.style.width = `${WIDTH}px`;
    canvas.current.style.height = `${HEIGHT}px`;

    const ctx = canvas.current.getContext("2d");
    if (ctx === null) {
      throw new Error("Couldn't get 2d context of canvas");
    }
    ctx.scale(CANVAS_SCALE, CANVAS_SCALE);

    props.getCtx(createContext(ctx, CANVAS_WIDTH / props.relWidth));
  }, [HEIGHT]);

  return (
    <canvas
      ref={canvas}
      style="border: 1px solid hotpink;"
      tabIndex={0}
      onKeyDown={props.onKeyDown}
      onKeyUp={props.onKeyUp}
    />
  );
}
