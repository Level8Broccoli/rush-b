package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.*
import ch.ffhs.rushb.controller.Level
import ch.ffhs.rushb.enums.CharacterState
import ch.ffhs.rushb.enums.Color
import ch.ffhs.rushb.enums.Orientation
import ch.kaiki.nn.neuralnet.NeuralNetwork
import gameLoop

class DeepBot(
    override val id: String,
    override val color: Color,
    override var position: Vector,
    override var paintId: Int,
    override var neuralNetwork: NeuralNetwork
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
    override var fitness = 0L
    override var visitedTiles: MutableList<String> = mutableListOf()

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
