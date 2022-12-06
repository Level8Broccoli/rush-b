package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.Scorable
import ch.ffhs.rushb.model.User

data class FinishedGame(
    override val id: String,
    override val creator: User,
    override val secondPlayer: User?,
    val player1: Scorable,
    val player2: Scorable,
) : Game {
    override fun toJSON(): String {
        return """
            {
                "id": "$id" , 
                "creator": ${creator.toJSON()},
                "secondPlayer": ${secondPlayer?.toJSON() ?: "null"},
                "player1": ${player1.toJSON()},
                "player2": ${player2.toJSON()}
            }
            """.trimIndent()
    }
}