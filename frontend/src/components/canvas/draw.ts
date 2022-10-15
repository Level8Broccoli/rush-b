import {TileMap, TILES} from "../../shared/model/tileMap.enum";
import {CanvasContext} from "./Canvas";
import {Character} from "../../shared/model/GameTypes";

function drawBackground(context: CanvasContext, tiles: TileMap) {
    const {ctx, scale} = context;

    tiles.tiles.forEach((row, y) => {
        row.forEach((t, x) => {
            const dx = scale(x);
            const dy = scale(y);
            const dWidth = scale(1);
            const dHeight = scale(1);
            if (t === TILES.FOUNDATION) {
                ctx.fillStyle = "#000";
            } else if (t === TILES.SKY) {
                ctx.fillStyle = "#4ff";
            }
            ctx.fillRect(dx, dy, dWidth, dHeight)
        })
    })
}

function drawCharacters(context: CanvasContext, characters: Character[]) {
    const NORM_FACTOR = 16; // TODO: Refactor on backend

    const {ctx, scale} = context;

    characters.forEach((c) => {
        const dx = scale(c.x / NORM_FACTOR);
        const dy = scale(c.y / NORM_FACTOR);
        const dWidth = scale(c.width / NORM_FACTOR);
        const dHeight = scale(c.height / NORM_FACTOR);
        ctx.fillStyle = c.color;
        ctx.fillRect(dx, dy, dWidth, dHeight)
    })
}

export {drawBackground, drawCharacters}
