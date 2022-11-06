package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.INITIAL_VELOCITY
import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.Paintable
import ch.ffhs.rushb.behavior.Scorable
import ch.ffhs.rushb.controller.Level
import ch.ffhs.rushb.enums.CharacterState
import ch.ffhs.rushb.enums.Color
import ch.ffhs.rushb.enums.Orientation
import gameLoop
import kotlin.random.Random

class RandomBot(
    override val id: String,
    override val color: Color,
    override var position: Vector,
    override var paintId: Int
) : Movable, Scorable, Paintable {
    override var orientation = Orientation.FACE
    override var width = 14.0
    override var height = 28.0
    override var velocity = Vector(0.0, INITIAL_VELOCITY.y)
    override var weight = 0.75
    override var jumpForce = 2.0
    override var speed = 12.0
    override var state = CharacterState.IDLE
    override var score = 0
    override var brush: Brush? = null

    override fun applyGameLoop(level: Level) {
        if (Random.nextBoolean()) {
            if (Random.nextBoolean()) {
                setVelocityX(1.0)
            } else {
                setVelocityX(-1.0)
            }
        } else {
            if (Random.nextBoolean()) {
                setVelocityY(level)
            }
        }
        paint(level)
        gameLoop(level, this)
    }

    override fun toJSON(): String {
        return """
            {
                "id": "$id", 
                "paintId": $paintId, 
                "color": "${color.value}", 
                "width": $width, 
                "height": $height, 
                "x": ${position.x}, 
                "y": ${position.y}, 
                "score": $score, 
                "state": "$state", 
                "orientation": "$orientation"
            }
        """.trimIndent(); }
}