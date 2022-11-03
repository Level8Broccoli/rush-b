package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.Serializable
import ch.ffhs.rushb.enums.CharacterType
import ch.ffhs.rushb.enums.Color
import ch.ffhs.rushb.model.Brush
import ch.ffhs.rushb.model.Character
import ch.ffhs.rushb.model.Npc
import ch.ffhs.rushb.model.Vector

class Game(
    override val id: String,
    private val level: Level,
) : Serializable {

    private val player1 =
        Character(
            CharacterType.MASK_DUDE.name,
            Color.RED,
            Vector(16.0, 0.0)
        )
    private val player2 =
        Character(
            CharacterType.PINK_MAN.name,
            Color.PURPLE,
            Vector(610.0, 0.0)
        )

    private val gameObjects = mutableListOf<Movable>()

    init {
        gameObjects.add(player1)
        gameObjects.add(player2)

        // TODO: initialize brush at 320

        gameObjects.add(
            Brush(
                CharacterType.VIRTUAL_GUY.name,
                Color.PINK,
                Vector(320.0, 0.0)
            )
        )

        gameObjects.add(
            Npc(
                CharacterType.NINJA_FROG.name,
                Color.PINK,
                Vector(100.0, 0.0)
            )
        )

        gameObjects.add(
            Npc(
                CharacterType.NINJA_FROG.name,
                Color.PINK,
                Vector(200.0, 0.0)
            )
        )

        gameObjects.add(
            Npc(
                CharacterType.NINJA_FROG.name,
                Color.PINK,
                Vector(300.0, 0.0)
            )
        )
        gameObjects.add(
            Npc(
                CharacterType.NINJA_FROG.name,
                Color.PINK,
                Vector(400.0, 0.0)
            )
        )
        gameObjects.add(
            Npc(
                CharacterType.NINJA_FROG.name,
                Color.PINK,
                Vector(500.0, 0.0)
            )
        )
        gameObjects.add(
            Npc(
                CharacterType.NINJA_FROG.name,
                Color.PINK,
                Vector(600.0, 0.0)
            )
        )
    }

    fun applyGameLoop() {
        for (i in 0 until gameObjects.size) {
            for (j in i + 1 until gameObjects.size) {
                gameObjects[i].validateIntersect(gameObjects[j])
            }
        }
        for (obj in gameObjects) {
            obj.applyGameLoop(level)
        }
    }

    fun getPlayer1(): Movable {
        return player1
    }

    override fun toJSON(): String {
        val characterJSON = gameObjects.map { it.toJSON() }.joinToString(",")
        val out = """
            {
                "id": "$id" , 
                "level": "${level.tileMap.name}" , 
                "characters": [$characterJSON]
            }
            """.trimIndent()
        return out.replace("NaN", "-100.0")
    }
}
