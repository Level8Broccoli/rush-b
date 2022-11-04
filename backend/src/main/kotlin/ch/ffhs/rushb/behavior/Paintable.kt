package ch.ffhs.rushb.behavior

import ch.ffhs.rushb.controller.Level
import ch.ffhs.rushb.model.Brush

interface Paintable {
    var brush: Brush?

    fun paint(level: Level) {
        if (this is Movable) {
            val v = this.center().div(16.0)
            level.tileMap.tiles
            if (level.tiles[v.y.toInt()][v.x.toInt()] != 1) {
                level.tiles[v.y.toInt()][v.x.toInt()] = 2
            }
        }
    }
}