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

/**
 * This class is used to train the generative ai. It simulates a game with all required components
 * and is able to rate the outcome of the game. The rating (i.e. fitness) will ensure, that
 * the algorithm is able to improve itself over multiple generations.
 */
class MockGame(neuralNetwork: NeuralNetwork?) : GeneticObject(neuralNetwork) {

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

        // add deep bot to be trained
        gameObjects.add(bot)

        // add mock players
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

        // add brushes
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

    /**
     * This method represents a game step.
     */
    fun applyGameLoop() {
        for (i in 0 until gameObjects.size) {
            for (j in i + 1 until gameObjects.size) {
                gameObjects[i].validateIntersect(gameObjects[j])
            }
        }
        for (obj in gameObjects) {
            obj.applyGameLoop(level, gameObjects)
        }
    }

    /**
     * After running the game loop, the outcome is rated.
     */
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

    /**
     * Returns the fitness of the bot, so rating metrics can be applied.
     */
    override fun getFitness(): Long {
        if (!rated) {
            bot.fitness += bot.visitedTiles.size * 100
            bot.fitness += bot.score * 1000000
            rated = true
        }
        return bot.fitness
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

    // ---------------- NO USE, BUT NEED TO BE IMPLEMENTED ----------------

    override fun isImmature(): Boolean {
        return false
    }

    override fun hasReachedGoal(): Boolean {
        return false
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