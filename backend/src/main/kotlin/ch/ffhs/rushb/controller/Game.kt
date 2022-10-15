package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.Serializable
import ch.ffhs.rushb.enums.CharacterType
import ch.ffhs.rushb.enums.Color
import ch.ffhs.rushb.model.*

class Game : Serializable {
    override val id = "game 0"
    private val level = Level(TileMap.ONE)
    private val player1 = AgentPlayer(
        Character(
            CharacterType.MASK_DUDE.name,
            Color.RED,
            Vector(16.0, 0.0)
        ),
        level
    )
    private val player2 = AgentPlayer(
        Character(
            CharacterType.PINK_MAN.name,
            Color.PURPLE,
            Vector(200.0, 0.0)
        ),
        level
    )

    private val gameObjects = mutableListOf<Agent>()

    init {
        gameObjects.add(player1)
        gameObjects.add(player2)

        gameObjects.add(
            AgentNpc(
                Npc(
                    CharacterType.NINJA_FROG.name,
                    Color.PINK,
                    Vector(100.0, 0.0)
                ),
                level
            )
        )
        gameObjects.add(
            AgentNpc(
                Npc(
                    CharacterType.NINJA_FROG.name,
                    Color.PINK,
                    Vector(120.0, 0.0)
                ),
                level
            )
        )

        gameObjects.add(
            AgentNpc(
                Npc(
                    CharacterType.NINJA_FROG.name,
                    Color.PINK,
                    Vector(125.0, 0.0)
                ),
                level
            )
        )
        gameObjects.add(
            AgentNpc(
                Npc(
                    CharacterType.NINJA_FROG.name,
                    Color.PINK,
                    Vector(135.0, 0.0)
                ),
                level
            )
        )
        gameObjects.add(
            AgentNpc(
                Npc(
                    CharacterType.NINJA_FROG.name,
                    Color.PINK,
                    Vector(140.0, 0.0)
                ),
                level
            )
        )
        gameObjects.add(
            AgentNpc(
                Npc(
                    CharacterType.NINJA_FROG.name,
                    Color.PINK,
                    Vector(160.0, 0.0)
                ),
                level
            )
        )
    }

    fun applyGameLoop() {
        for (i in 0 until gameObjects.size) {
            for (j in i + 1 until gameObjects.size) {
                gameObjects.get(i).validateIntersect(gameObjects.get(j))
            }
        }
        for (obj in gameObjects) {
            obj.applyGameLoop()
        }
    }

    fun getPlayer1(): AgentPlayer {
        return player1
    }

    override fun toJSON(): String {
        var out = """
            {
                "id": "$id" , 
                "level": "${level.tileMap.name}" , 
                "characters": [
            """.trimIndent()

        for (i in 0 until gameObjects.size) {
            out += gameObjects[i].toJSON()
            if (i < gameObjects.size - 1) {
                out += ","
            }
        }
        out += "]}"
        return out.replace("NaN", "-100.0")
    }
}
