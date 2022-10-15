package ch.ffhs.rushb.controller

import ch.ffhs.rushb.model.*

class Game {
    private val id = "game 0"
    private val level = Level(TileMap.ONE)
    private val player1 = AgentPlayer(Character(
        CharacterType.MASK_DUDE.name,
        "red",
        Vector(16.0, 0.0)),
        level
    );
    private val player2 = AgentPlayer(Character(
        CharacterType.PINK_MAN.name,
        "purple",
        Vector(200.0, 0.0)),
        level
    );

    private val gameObjects = mutableListOf<Agent>()

    init {
        gameObjects.add(player1)
        gameObjects.add(player2)

        gameObjects.add(AgentNpc(Npc(
            CharacterType.NINJA_FROG.name,
            "pink",
            Vector(100.0, 0.0)),
            level
        ))
        gameObjects.add(AgentNpc(Npc(
            CharacterType.NINJA_FROG.name,
            "pink",
            Vector(120.0, 0.0)),
            level
        ))
        gameObjects.add(AgentNpc(Npc(
            CharacterType.NINJA_FROG.name,
            "pink",
            Vector(125.0, 0.0)),
            level
        ))
        gameObjects.add(AgentNpc(Npc(
            CharacterType.NINJA_FROG.name,
            "pink",
            Vector(135.0, 0.0)),
            level
        ))
        gameObjects.add(AgentNpc(Npc(
            CharacterType.NINJA_FROG.name,
            "pink",
            Vector(140.0, 0.0)),
            level
        ))
        gameObjects.add(AgentNpc(Npc(
            CharacterType.NINJA_FROG.name,
            "pink",
            Vector(160.0, 0.0)),
            level
        ))
    }

    fun applyGameLoop() {
        for (i in 0 until gameObjects.size) {
            for (j in i+1 until gameObjects.size) {
                gameObjects.get(i).validateIntersect(gameObjects.get(j))
            }
        }
        for (obj in gameObjects) {
            obj.applyGameLoop()
        }
    }

    fun getPlayer1(): AgentPlayer {
        return player1;
    }

    fun getCharacter1(): GameObject {
        return player1.character;
    }

    override fun toString(): String {
        var out = "{\"id\": \"" + id +
                "\" , \"level\": \"" + level.tileMap.name +
                "\" , \"characters\": ["

        for (i in 0 until gameObjects.size) {
            out += gameObjects.get(i).toString()
            if (i < gameObjects.size-1) {
                out += ","
            }
        }
        out += "]}"
        return out.replace("NaN", "-100.0")
    }

}
