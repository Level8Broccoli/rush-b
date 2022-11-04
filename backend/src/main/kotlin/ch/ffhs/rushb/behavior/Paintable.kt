package ch.ffhs.rushb.behavior

import ch.ffhs.rushb.controller.Level
import ch.ffhs.rushb.model.Brush

interface Paintable {
    var paintId: Int            // 0 = empty; range 1-99 = tiles; range >= 100 = paintable id's
    var brush: Brush?

    fun paint(level: Level) {
        if (this is Movable) {
            val v = this.center().div(16.0)
            level.tileMap.tiles
            if (level.tiles[v.x.toInt()][v.y.toInt()] < 1 || level.tiles[v.x.toInt()][v.y.toInt()] >= 100) {
                level.tiles[v.x.toInt()][v.y.toInt()] = this.paintId
            }
        }
    }
}