package ch.ffhs.rushb.behavior.ai

import ch.ffhs.rushb.behavior.AIable
import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.controller.Level
import ch.ffhs.rushb.enums.CharacterType
import ch.ffhs.rushb.enums.Color
import ch.kaiki.nn.genetic.GeneticObject
import ch.kaiki.nn.neuralnet.NeuralNetwork
import ch.ffhs.rushb.model.*
import kotlin.random.Random


open class MockGame(neuralNetwork: NeuralNetwork?) : GeneticObject(neuralNetwork) {

    val level = Level(TileMap.ONE)
    val limit = 600     // (1000 * 60 * 2) / 200 -> two minutes / calculation step
    var counter = 100
    val gameObjects = mutableListOf<Movable>()
    val bot = DeepBot(CharacterType.MASK_DUDE.name, Color.PURPLE, Vector(Random.nextDouble(100.0,600.0),0.0), 200, neuralNetwork!!)
    var rated = false

    init {

        val numberOfMockPlayers = 1
        val numberOfBrushes = 10
        val numberOfNpcs = 1

        // add players
        gameObjects.add(bot)
        for (i in 0 until numberOfMockPlayers) {
            gameObjects.add(
                RandomBot(
                    CharacterType.PINK_MAN.name,
                    Color.RED,
                    Vector(Random.nextDouble(100.0, 600.0), 0.0),
                    210 + i
                )
            )
        }

        // add brush
        for (i in 0 until numberOfBrushes) {
            gameObjects.add(
                Brush(
                    CharacterType.VIRTUAL_GUY.name,
                    Color.PINK,
                    Vector(Random.nextDouble(100.0, 600.0), 0.0)
                )
            )
        }

        // add npcs
        for (i in 0 until numberOfNpcs) {
            gameObjects.add(
                Npc(
                CharacterType.NINJA_FROG.name,
                Color.PINK,
                Vector(Random.nextDouble(100.0, 600.0), 0.0)
            )
            )
        }
    }

    fun applyGameLoop() {
        for (i in 0 until gameObjects.size) {
            for (j in i + 1 until gameObjects.size) {
                gameObjects[i].validateIntersect(gameObjects[j])
            }
        }
        for (obj in gameObjects) {
            if (obj is AIable) {
                obj.predict(level, gameObjects)
            }
            obj.applyGameLoop(level)
        }
    }

    override fun perform(): Boolean {
        applyGameLoop()
        counter += 1

        if (bot.brush != null) {
            bot.fitness += 1
        }
        if ((Math.abs(bot.velocity.x) > 0 || Math.abs(bot.velocity.y) > 0) && !level.collidesLeft(bot as Movable)  && !level.collidesRight(bot as Movable)) {
            bot.fitness += 10
        }
        return counter <= limit
    }

    override fun getFitness(): Long {
        if (!rated) {
            bot.fitness += bot.visitedTiles.size * 100
            bot.fitness += bot.score * 1000000
            rated = true
        }
        return bot.fitness
    }

    // not used but not removable
    override fun isImmature(): Boolean {
        return false
    }

    // not used but not removable
    override fun hasReachedGoal(): Boolean {
        return false
    }

    fun toJSON(): String {
        val characterJSON = gameObjects.map { it.toJSON() }.joinToString(",")
        var levelJSON = "[" +level.tiles.map { "[" +it.map{it -> it}.joinToString(",") +"]"}.joinToString(",")+"]"
        val out = """
            {
                "id": "mock game" , 
                "timer": "00:00" , 
                "level": "${levelJSON}" , 
                "characters": [$characterJSON]
            }
            """.trimIndent()
        return out.replace("NaN", "-100.0")
    }

    fun setVelocityX(player: Movable, d: Double) {

    }

    fun setVelocityY(player: Movable) {

    }

    fun paint(player: Movable) {

    }

    fun getPlayer1(): Movable {
        return bot
    }
}