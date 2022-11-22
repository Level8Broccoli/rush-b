package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.Serializable
import ch.ffhs.rushb.enums.TileMap
import ch.ffhs.rushb.model.User

class OpenGame(override val id: String, val creator: User, var secondPlayer: User? = null) : Serializable {
    fun startGame(): RunningGame {
        return RunningGame(id, creator, Level(TileMap.values().toList().shuffled().first()))
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