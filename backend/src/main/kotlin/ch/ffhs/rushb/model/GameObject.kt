package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.Serializable

abstract class GameObject(
    val id: String,
    val color: String,
    var position: Vector
) : Serializable {
    var width: Double = 0.0
    var height: Double = 0.0
    var state: CharacterState = CharacterState.IDLE
    var orientation: CharacterOrientation = CharacterOrientation.FACE
    var score: Int = 0
    val yVelocityInitial: Double = 0.0
    var velocity: Vector = Vector(0.0, yVelocityInitial)
    var weight: Double = 0.0
    var jumpForce: Double = 0.0
    var speed: Double = 0.0

    fun top(): Double {
        return position.y
    }

    fun bottom(): Double {
        return position.y + height
    }

    fun left(): Double {
        return position.x
    }

    fun right(): Double {
        return position.x + width
    }
}