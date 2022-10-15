import { TileMap, TILES } from "../../shared/model/tileMap.enum";
import { CanvasContext } from "./Canvas";
import { Character } from "../../shared/model/GameTypes";
import { drawSprite, SPRITES } from "./Sprite";

function drawBackground(context: CanvasContext, tiles: TileMap) {
  const { ctx, scale } = context;

  tiles.tiles.forEach((row, y) => {
    row.forEach(async (t, x) => {
      const dx = scale(x);
      const dy = scale(y);
      const dWidth = scale(1);
      const dHeight = scale(1);
      if (t === TILES.FOUNDATION) {
        await drawSprite(ctx, SPRITES.TERRAIN, dx, dy, dWidth, dHeight);
      } else if (t === TILES.SKY) {
        await drawSprite(ctx, SPRITES.BACKGROUND, dx, dy, dWidth, dHeight);
      }
    });
  });
}

function drawCharacters(context: CanvasContext, characters: Character[]) {
  const NORM_FACTOR = 16; // TODO: Refactor on backend

  const { ctx, scale } = context;

  characters.forEach(async (c) => {
    const dx = scale(c.x / NORM_FACTOR);
    const dy = scale(c.y / NORM_FACTOR);
    const dWidth = scale(c.width / NORM_FACTOR);
    const dHeight = scale(c.height / NORM_FACTOR);
    ctx.fillStyle = c.color;
    ctx.fillRect(dx, dy, dWidth, dHeight);
    await drawSprite(ctx, SPRITES.CHARACTER, dx, dy, dWidth, dHeight);
  });
}

export { drawBackground, drawCharacters };
