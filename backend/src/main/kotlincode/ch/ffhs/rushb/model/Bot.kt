package kotlincode.ch.ffhs.rushb.model

import kotlincode.ch.ffhs.rushb.behavior.*
import kotlincode.ch.ffhs.rushb.controller.Level
import kotlincode.ch.ffhs.rushb.enums.CharacterState
import kotlincode.ch.ffhs.rushb.enums.Color
import kotlincode.ch.ffhs.rushb.enums.Orientation
import kotlincode.ch.ffhs.rushb.behavior.ai.SeedUtil

class Bot(
    override val id: String,
    override val color: Color,
    override var position: Vector,
    override var paintId: Int
) : Movable, Scorable, Paintable, AIable {
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
    override var neuralNetwork = SeedUtil().getSeed()

    override fun applyGameLoop(level: Level) {
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
