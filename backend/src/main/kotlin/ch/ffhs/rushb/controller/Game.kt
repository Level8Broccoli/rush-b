package ch.ffhs.rushb.controller

import ch.ffhs.rushb.model.*

class Game {
    private val id = "game 0"
    private val level = Level(TileMap.ONE)
    private val player1 = AgentPlayer(Character(
        "you",
        "red",
        Vector(16.0, 0.0)),
        level
    );
    private val player2 = AgentPlayer(Character(
        "dummy-player",
        "purple",
        Vector(32.0, 0.0)),
        level
    );

    private val npc1 = AgentNpc(Npc(
        "npc1",
        "pink",
        Vector(65.0, 0.0)),
        level
    );

    private val gameObjects = mutableListOf<Agent>()

    init {
        gameObjects.add(player1)
        gameObjects.add(player2)
        gameObjects.add(npc1)
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
                "\" , \"level\": \"" + level +
                "\" , \"characters\": ["

        for (i in 0 until gameObjects.size) {
            out += gameObjects.get(i).toString()
            if (i < gameObjects.size-1) {
                out += ","
            }
        }
        out += "]}"
        return out
    }

}
