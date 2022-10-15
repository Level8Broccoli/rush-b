package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.INITIAL_VELOCITY
import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.Scorable
import ch.ffhs.rushb.behavior.Serializable
import ch.ffhs.rushb.enums.CharacterState
import ch.ffhs.rushb.enums.Color
import ch.ffhs.rushb.enums.Orientation

class Npc(
    override val id: String,
    override val color: Color,
    override var position: Vector,
) : GameObject(), Serializable, Movable, Scorable {
    override var orientation = Orientation.FACE
    override var velocity = Vector(0.0, INITIAL_VELOCITY.y)
    override var width = 8.0
    override var height = 8.0
    override var weight = 0.25
    override var jumpForce = 1.0
    override var speed = 4.0
    override var state = CharacterState.IDLE
    override var score = 0
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