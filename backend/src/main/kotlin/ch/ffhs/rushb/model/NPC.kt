package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.INITIAL_VELOCITY
import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.gameLoop
import ch.ffhs.rushb.controller.Level
import ch.ffhs.rushb.enums.CharacterState
import ch.ffhs.rushb.enums.Color
import ch.ffhs.rushb.enums.Orientation
import kotlin.random.Random

class NPC(
    override val id: String,
    override val color: Color,
    override var position: Vector,
) : Movable {
    override var orientation = Orientation.FACE
    override var velocity = Vector(0.0, INITIAL_VELOCITY.y)
    override var width = 12.0
    override var height = 12.0
    override var weight = 0.25
    override var jumpForce = 1.0
    override var speed = 4.0
    override var state = CharacterState.IDLE
    var isChaser = Random.nextBoolean()

    override fun applyGameLoop(level: Level, gameObjects: MutableList<Movable>) {
        var distance = Double.MAX_VALUE
        val radius = 16 * 3
        var nearestCharacter: Character? = null
        for (obj in gameObjects) {
            if (!(obj is Character)) {
                continue
            }
            val d = this.position.distance(obj.position)
            if (d < distance) {
                distance = d
                if (d < radius) {
                    nearestCharacter = obj
                }
            }
        }

        if (nearestCharacter != null) {
            val pos = nearestCharacter.position.get()
            pos.subtract(this.position)
            val direction = pos.div(this.position.magnitude())
            if (!isChaser) {
                direction.switch()
            }
            if (direction.x > 0.0) {
                setVelocityX(1.0)
            } else if (direction.x < 0) {
                setVelocityX(-1.0)
            }
            if (direction.y < 0) {
                setVelocityY(level)
            }
        } else {
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
        }
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