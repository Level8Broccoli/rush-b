package kotlincode.ch.ffhs.rushb.behavior.ai

import kotlincode.ch.ffhs.rushb.behavior.AIable
import kotlincode.ch.ffhs.rushb.behavior.Movable
import kotlincode.ch.ffhs.rushb.controller.Level
import kotlincode.ch.ffhs.rushb.enums.CharacterType
import kotlincode.ch.ffhs.rushb.enums.Color
import ch.kaiki.nn.genetic.GeneticObject
import ch.kaiki.nn.neuralnet.NeuralNetwork
import kotlincode.ch.ffhs.rushb.model.*
import kotlin.random.Random


class MockGame(neuralNetwork: NeuralNetwork?) : GeneticObject(neuralNetwork) {

    val level = Level(TileMap.ONE)
    val limit = 600     // (1000 * 60 * 2) / 200 -> two minutes / calculation step
    var counter = 100
    val gameObjects = mutableListOf<Movable>()
    val bot = Bot("Bot", Color.RED, Vector(Random.nextDouble(100.0,600.0),0.0), 200)

    init {
        bot.neuralNetwork = neuralNetwork!!

        val numberOfMockPlayers = 2
        val numberOfBrushes = 10
        val numberOfNpcs = 6

        // add players
        gameObjects.add(bot)
        for (i in 0 until numberOfMockPlayers) {
            gameObjects.add(
                MockCharacter(
                    "mockCharacter",
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
        return counter <= limit
    }

    override fun getFitness(): Double {
        bot.fitness += bot.score * 100
        return bot.fitness.toDouble()
    }

    // not used but not removable
    override fun isImmature(): Boolean {
        return false
    }

    // not used but not removable
    override fun hasReachedGoal(): Boolean {
        return false
    }
}