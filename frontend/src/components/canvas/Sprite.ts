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
  MASK_DUDE: {
    path: "/assets/pixel-adventure-1/Main Characters/Mask Dude/",
    image: "Fall (32x32).png",
    x: 0,
    y: 0,
    width: 32,
    height: 32,
  },
  PINK_MAN: {
    path: "/assets/pixel-adventure-1/Main Characters/Pink Man/",
    image: "Fall (32x32).png",
    x: 0,
    y: 0,
    width: 32,
    height: 32,
  },
  NiNJA_FROG: {
    path: "/assets/pixel-adventure-1/Main Characters/Ninja Frog/",
    image: "Fall (32x32).png",
    x: 0,
    y: 0,
    width: 32,
    height: 32,
  },
  VIRTUAL_GUY: {
    path: "/assets/pixel-adventure-1/Main Characters/Virtual Guy/",
    image: "Fall (32x32).png",
    x: 0,
    y: 0,
    width: 32,
    height: 32,
  },
};

type ImageStorage = {
  [path: string]: HTMLImageElement;
};
const imageStorage: ImageStorage = {};

async function loadImage(path: string): Promise<HTMLImageElement> {
  let image = new Image();
  let promise = new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
  image.src = path;
  return promise;
}

async function getImage(path: string): Promise<HTMLImageElement> {
  if (imageStorage[path]) {
    return imageStorage[path];
  }
  const image = await loadImage(path);
  imageStorage[path] = image;
  return image;
}

export async function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  dx: number,
  dy: number,
  dWidth: number,
  dHeight: number
) {
  const path = [
    ...sprite.path.split("/").filter((s) => s.length > 0),
    sprite.image,
  ].join("/");
  const image = await getImage(path);

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
}
