package ch.ffhs.rushb.behavior

import ch.ffhs.rushb.controller.Level
import ch.ffhs.rushb.model.Brush

interface Paintable {
    var paintId: Int            // 0 = empty; range 1-99 = tiles; range >= 100 = paintable id's
    var brush: Brush?

    fun paint(level: Level) {
        if (this is Movable) {
            val v = this.center().div(16.0)
            var _x = v.x.toInt()
            var _y = v.y.toInt()
            if (_x < 0 || _y < 0 || brush == null) {
                return
            }
            if (level.tiles[_x][_y] < 1 || level.tiles[_x][_y] >= 100) {
                level.tiles[_x][_y] = this.paintId
            }
        }
    }
}