package ch.ffhs.rushb.controller

import ch.ffhs.rushb.model.*

class Game {
    private val level = Level(TileMap.ONE)
    private val player1 = AgentPlayer(Character(
        "test-id",
        "red",
        VectorDto(16.0, 0.0)),
        level
    );
    private val player2 = AgentPlayer(Character(
        "dummy-player",
        "purple",
        VectorDto(32.0, 0.0)),
        level
    );

    private val npc1 = AgentNpc(Npc(
        "npc1",
        "lightblue",
        VectorDto(65.0, 0.0)),
        level
    );

    private val gameObjects = mutableListOf<Agent>()

    init {
        gameObjects.add(player1)
        gameObjects.add(player2)
        gameObjects.add(npc1)
    }

    fun applyGameLoop() {
        player1.applyGameLoop()
        player2.applyGameLoop()
        npc1.applyGameLoop()
        //TODO: make players interact
    }

    fun getPlayer1(): AgentPlayer {
        return player1;
    }

    fun getCharacter1(): GameObject {
        return player1.character;
    }

}
