type Sprite = {
  path: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type SpriteCollection = {
  [K: string]: Sprite;
};

export const SPRITES: SpriteCollection = {
  BACKGROUND: {
    path: "/assets/pixel-adventure-1/Background",
    image: "Yellow.png",
    x: 0,
    y: 0,
    width: 64,
    height: 64,
  },
  TERRAIN: {
    path: "/assets/pixel-adventure-1/Terrain",
    image: "Terrain (16x16).png",
    x: 0,
    y: 0,
    width: 16,
    height: 16,
  },
  CHARACTER: {
    path: "/assets/pixel-adventure-1/Main Characters/Mask Dude/",
    image: "Fall (32x32).png",
    x: 0,
    y: 0,
    width: 32,
    height: 32,
  },
};

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  dx: number,
  dy: number,
  dWidth: number,
  dHeight: number
) {
  const image = new Image();
  image.src = [
    ...sprite.path.split("/").filter((s) => s.length > 0),
    sprite.image,
  ].join("/");
  image.onload = function () {
    ctx.drawImage(
      image,
      sprite.x,
      sprite.y,
      sprite.width,
      sprite.height,
      dx,
      dy,
      dWidth,
      dHeight
    );
  };
}
