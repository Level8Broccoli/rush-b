package ch.ffhs.rushb.behavior

import ch.ffhs.rushb.controller.Level

interface Scorable {
    var score: Int

    fun score(level: Level) {
        if (this is Paintable) {
            var scorePoints = 0
            for (i in 0 until level.tiles.size) {
                for (j in 0 until level.tiles[0].size) {
                    if (level.tiles[i][j] == this.paintId) {
                        scorePoints += 1
                    }
                }
            }
            this.score = scorePoints
        }
    }
}