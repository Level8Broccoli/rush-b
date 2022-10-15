package ch.ffhs.rushb.behavior

import ch.ffhs.rushb.controller.Level
import ch.ffhs.rushb.model.Vector


// ---------------- DETECT MOVES OF CHARACTER ----------------

/**
 * Method to check for horizontal movement of character.
 */
private fun getDeltaX(level: Level, character: Movable): Double {
    val distance: Double
    var delta = 0.0
    val vel = character.velocity.x * character.speed

    if (character.velocity.x < 0) {          // going left
        distance = -level.getDistanceToLeft(character)
        delta = vel.coerceAtLeast(distance)    // max
    } else if (character.velocity.x > 0) {   // going right
        distance = level.getDistanceToRight(character)
        delta = vel.coerceAtMost(distance)     // min
    }
    return delta
}

/**
 * Method to check for vertical movement of
 */
private fun getDeltaY(level: Level, character: Movable): Double {
    val distance: Double
    val delta: Double
    val vel = character.velocity.y * character.speed

    if (character.velocity.y < 0) {      // going up
        distance = -level.getDistanceToTop(character)
        delta = vel.coerceAtLeast(distance)    // max
        if (distance >= -0.05 && vel < -0.05) {
            character.velocity.y = -1 * character.velocity.y                // reverse yVelocity when head was hit
        }
    } else {                            // going down
        distance = level.getDistanceToBottom(character)
        delta = vel.coerceAtMost(distance)     // min
    }
    return delta
}

fun getDelta(level: Level, character: Movable): Vector {
    return Vector(getDeltaX(level, character), getDeltaY(level, character))
}
