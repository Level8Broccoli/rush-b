import { useCallback, useEffect, useRef } from "preact/compat";

const useCanvas = (getData: any) => {
  const canvasRef = useRef(null);
  let counter = useRef(0);
  let drawing = useRef(false);

  function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect();
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  const drawData = useCallback(
    (canvs: HTMLCanvasElement, getData: () => any) => {
      const point = getData();
      const context = canvs.getContext("2d");
      if (context === null) {
        return;
      }
      if (point === undefined || point.id <= counter.current) {
        drawing.current = false;
        return;
      }
      drawing.current = true;
      counter.current = point.id;
      const color = point.strokeStyle;

      if (color === "eraser") {
        context.globalCompositeOperation = "destination-out";
      } else {
        context.globalCompositeOperation = "source-over";
        context.strokeStyle = color;
      }
      context.lineWidth = point.lineWidth;
      context.lineCap = "round";

      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      // @ts-ignore
      const x = point.x * canvas.width;
      // @ts-ignore
      const y = point.y * canvas.height;
      if (point.action === "moveTo") {
        context.beginPath();
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
        context.stroke();
      }
      drawData(canvs, getData);
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    // @ts-ignore
    resizeCanvasToDisplaySize(canvas);
    // @ts-ignore
    const context = canvas.getContext("2d");
    let animationFrameId: number;
    const render = () => {
      if (!drawing.current) {
        drawData(context, getData);
      }
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [drawData, drawing, getData]);

  return canvasRef;
};

export default useCanvas;
