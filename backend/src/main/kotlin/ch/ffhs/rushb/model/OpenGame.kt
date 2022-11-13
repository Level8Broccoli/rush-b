package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.Serializable
import ch.ffhs.rushb.controller.RunningGame
import ch.ffhs.rushb.controller.Level

data class OpenGame(override val id: String, val creator: User, var secondPlayer: User? = null) : Serializable {
    fun startGame(): RunningGame {
        return RunningGame(id, creator, Level(TileMap.ONE))
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