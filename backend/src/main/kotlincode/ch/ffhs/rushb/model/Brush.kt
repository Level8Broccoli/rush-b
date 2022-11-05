package kotlincode.ch.ffhs.rushb.model

import kotlincode.ch.ffhs.rushb.behavior.Grabbable
import kotlincode.ch.ffhs.rushb.behavior.INITIAL_VELOCITY
import kotlincode.ch.ffhs.rushb.behavior.Movable
import kotlincode.ch.ffhs.rushb.controller.Level
import kotlincode.ch.ffhs.rushb.enums.CharacterState
import kotlincode.ch.ffhs.rushb.enums.Color
import kotlincode.ch.ffhs.rushb.enums.Orientation
import kotlincode.ch.ffhs.rushb.behavior.gameLoop

class Brush(
    override val id: String,
    override val color: Color,
    override var position: Vector,
) : Movable, Grabbable {
    override var orientation = Orientation.FACE
    override var velocity = Vector(0.0, INITIAL_VELOCITY.y)
    override var width = 8.0
    override var height = 8.0
    override var weight = 0.25
    override var jumpForce = 0.0
    override var speed = 4.0
    override var state = CharacterState.IDLE
    override var movable: Movable? = null

    override fun applyGameLoop(level: Level) {
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