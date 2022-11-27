package ch.ffhs.rushb.controller

import ch.ffhs.rushb.enums.TileMap
import ch.ffhs.rushb.model.User

class OpenGame(
    override val id: String,
    override val creator: User,
    override var secondPlayer: User? = null
) : Game {
    fun startGame(): RunningGame {
        return RunningGame(id, creator, secondPlayer, Level(TileMap.values().toList().shuffled().first()))
    }

    override fun toJSON(): String {
        return """
            {
                "id": "$id",
                 "creator": ${creator.toJSON()},
                 "secondPlayer": ${secondPlayer?.toJSON() ?: "null"}
            }
            """.trimIndent()
    }
}