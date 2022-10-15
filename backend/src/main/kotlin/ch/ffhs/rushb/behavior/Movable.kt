package ch.ffhs.rushb.behavior

import ch.ffhs.rushb.model.Orientation
import ch.ffhs.rushb.model.Vector

val INITIAL_VELOCITY = Vector(0.0, 0.0)

interface Movable {
    var position: Vector
    var width: Double
    var height: Double
    var orientation: Orientation
    var velocity: Vector
    var weight: Double
    var jumpForce: Double
    var speed: Double

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