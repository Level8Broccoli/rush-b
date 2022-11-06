package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.AIable
import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.Paintable
import ch.ffhs.rushb.behavior.Serializable
import ch.ffhs.rushb.behavior.ai.SeedUtil
import ch.ffhs.rushb.enums.CharacterType
import ch.ffhs.rushb.enums.Color
import ch.ffhs.rushb.model.*
import ch.ffhs.rushb.model.Vector
import java.util.*
import kotlin.concurrent.schedule
import kotlin.random.Random

class Game(
    override val id: String,
    private val level: Level,

    ) : Serializable {
    private val timer = Timer()
    private var millis = 0L
    private val limit = 1000 * 60 * 2

    private val player1 =
        Character(
            CharacterType.MASK_DUDE.name,
            Color.RED,
            Vector(16.0, 0.0),
            100

        )
    private val player2 =
        DeepBot(
            CharacterType.PINK_MAN.name,
            Color.PURPLE,
            Vector(610.0, 0.0),
            101,
            SeedUtil().load()
        )

    private val gameObjects = mutableListOf<Movable>()

    init {

        // add players
        gameObjects.add(player1)
        gameObjects.add(player2)

        val numberOfBrushes = 10
        val numberOfNpcs = 10

        // add brush
        for (i in 0 until numberOfBrushes) {
            gameObjects.add(
                Brush(
                    CharacterType.VIRTUAL_GUY.name,
                    Color.PINK,
                    Vector(Random.nextInt(100,600).toDouble(), 0.0)
                )
            )
        }

        // add npcs
        for (i in 0 until numberOfNpcs) {
            gameObjects.add(
                Npc(
                    CharacterType.NINJA_FROG.name,
                    Color.PINK,
                    Vector(Random.nextInt(100,600).toDouble(), 0.0)
                )
            )
        }


        val period = 100L
        timer.schedule(100,period) {
            millis += period
            if (millis >= limit) {
                timer.cancel()
            }
        }
    }

    fun paint(player: Movable) {
        if (player is Paintable) {
            player.paint(level)
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
            obj.applyGameLoop(level, gameObjects)
        }
    }

    fun getPlayer1(): Movable {
        return player1
    }

    override fun toJSON(): String {
        val characterJSON = gameObjects.map { it.toJSON() }.joinToString(",")
        var levelJSON = "[" +level.tiles.map { "[" +it.map{it -> it}.joinToString(",") +"]"}.joinToString(",")+"]"
        val out = """
            {
                "id": "$id" , 
                "timer": "${counterToTime()}" , 
                "level": "${levelJSON}" , 
                "characters": [$characterJSON]
            }
            """.trimIndent()
        return out.replace("NaN", "-100.0")
    }

    /**
     * Method to transform milliseconds to nice formatted time string.
     */
    private fun counterToTime(): String {
        return ((limit-millis)/(1000*60)).toString().padStart(2,'0') + ":" + (((limit-millis)/(1000))%60).toString().padStart(2,'0')
    }

    fun setVelocityX(player: Movable, d: Double) {
        player.setVelocityX(d)
    }

    fun setVelocityY(player: Movable) {
        player.setVelocityY(level)
    }
}
