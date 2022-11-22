package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.Grabbable
import ch.ffhs.rushb.behavior.INITIAL_VELOCITY
import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.gameLoop
import ch.ffhs.rushb.controller.Level
import ch.ffhs.rushb.enums.CharacterState
import ch.ffhs.rushb.enums.Color
import ch.ffhs.rushb.enums.Orientation
import kotlin.random.Random

class Brush(
    override val id: String,
    override val color: Color,
    override var position: Vector,
) : Movable, Grabbable {
    override var orientation = Orientation.RIGHT
    override var velocity = Vector(0.0, INITIAL_VELOCITY.y)
    override var width = 8.0
    override var height = 8.0
    override var weight = 0.25
    override var jumpForce = 0.0
    override var speed = 4.0
    override var state = CharacterState.IDLE
    override var movable: Movable? = null

    init {
        if (Random.nextBoolean()) {
            orientation = Orientation.LEFT
        }
    }

    override fun applyGameLoop(level: Level, gameObjects: MutableList<Movable>) {
        gameLoop(level, this)
    }

    override fun toJSON(): String {
        return """
            {   
                "id": "$id", 
                "color": "$color", 
                "width": $width, 
                "height": $height, 
                "x": ${position.x}, 
                "y": ${position.y}, 
                "state": "$state", 
                "orientation": "$orientation"
            }
        """.trimIndent()
    }
}