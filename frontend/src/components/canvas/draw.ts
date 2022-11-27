import { TILES } from "../../state/tileMap.enum";
import { CanvasContext } from "./Canvas";
import { drawCharacterSprite, drawSprite, SPRITES, SpriteType } from "./Sprite";
import { Character } from "../../state/stateTypes";

function drawBackground(
  context: CanvasContext,
  tiles: number[][],
  characters: Character[]
) {
  const { ctx, scale } = context;
  tiles.forEach((col, x) => {
    col.forEach(async (t, y) => {
      const dx = scale(x);
      const dy = scale(y);
      const dWidth = scale(1);
      const dHeight = scale(1);
      if (t === TILES.FOUNDATION) {
        await drawSprite(
          ctx,
          SPRITES[SpriteType.TERRAIN],
          dx,
          dy,
          dWidth,
          dHeight
        );
      } else if (t === TILES.SKY) {
        await drawSprite(
          ctx,
          SPRITES[SpriteType.BACKGROUND],
          dx,
          dy,
          dWidth,
          dHeight
        );
      } else if (t === TILES.BOX) {
        await drawSprite(ctx, SPRITES[SpriteType.BOX], dx, dy, dWidth, dHeight);
      } else {
        const character = characters.find((c) => c.paintId == t);
        if (character !== undefined) {
          ctx.fillStyle = character.color;
          ctx.fillRect(dx, dy, dWidth, dHeight);
        }
      }
    });
  });
}

async function drawCharacters(
  context: CanvasContext,
  characters: Character[],
  counter: number
) {
  const NORM_FACTOR = 16; // TODO: Refactor on backend

  const { ctx, scale } = context;

  for (const c of characters) {
    const dx = scale(c.x / NORM_FACTOR);
    const dy = scale(c.y / NORM_FACTOR);
    const dWidth = scale(c.width / NORM_FACTOR);
    const dHeight = scale(c.height / NORM_FACTOR);
    ctx.fillStyle = c.color;
    const sprite = SPRITES[c.id];

    await drawCharacterSprite(ctx, sprite, dx, dy, dWidth, dHeight, c, counter);
  }
}

export { drawBackground, drawCharacters };
