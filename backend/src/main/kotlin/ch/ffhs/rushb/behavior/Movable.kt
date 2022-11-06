package ch.ffhs.rushb.behavior

import ch.ffhs.rushb.controller.Level
import ch.ffhs.rushb.enums.CharacterState
import ch.ffhs.rushb.enums.Color
import ch.ffhs.rushb.enums.Orientation
import ch.ffhs.rushb.model.Brush
import ch.ffhs.rushb.model.Vector

val INITIAL_VELOCITY = Vector(0.0, 0.0)

interface Movable : Serializable {
    val color: Color
    var position: Vector
    var width: Double
    var height: Double
    var orientation: Orientation
    var velocity: Vector
    var weight: Double
    var jumpForce: Double
    var speed: Double
    var state: CharacterState

    fun applyGameLoop(level: Level, gameObjects: MutableList<Movable>)

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

    fun center(): Vector {
        return Vector(position.x + (width / 2), position.y + (height / 2))
    }

    // ---------------- MOVING BY USER INPUT ----------------

    /**
     * This method is used to change the horizontal speed of the character by user input.
     * @param x: the user input; -1.0 in left hand oriented movement, 1.0 in right hand oriented movement
     */
    fun setVelocityX(x: Double) {
        velocity.x = x
        orientation = if (x > 0) {
            Orientation.RIGHT
        } else if (x < 0) {
            Orientation.LEFT
        } else {
            Orientation.FACE
        }
    }

    /**
     * This method is used to command a jump by user input. A jump can be applied only if the character is currently standing on ground.
     */
    fun setVelocityY(level: Level) {
        if (level.collidesBottom(this)) {
            velocity.y = -jumpForce
        }
    }

    /**
     * Checks if two characters intersect. If yes, collision detection is applied to change the velocity vector.
     */
    fun validateIntersect(other: Movable) {
        if (intersects(other)) {
            collide(other)
        }
    }

    // ---------------- MOVING TRIGGERED BY GAME LOOP ----------------

    /**
     * Function to move characters x and y coordinate
     */
    fun move(delta: Vector) {
        position.x += delta.x
        position.y += delta.y
        if (this is Paintable && this.brush != null) {
            this.brush!!.position = this.center()
        }
    }

    private fun intersects(other: Movable): Boolean {
        return !(other.position.x > position.x + width ||
                position.x > other.position.x + other.width ||
                other.position.y > position.y + height ||
                position.y > other.position.y + other.height)
    }

    private fun collide(other: Movable) {
        // lose brush if colliding with some oher characer
        if (this is Paintable && this.brush !== null && !(other is Brush)) {
            this.brush!!.movable = null
            this.brush = null
        } else if (other is Paintable && other.brush !== null && !(this is Brush)) {
            other.brush!!.movable = null
            other.brush = null
        }

        // grab brush if colliding with it
        if (this is Paintable && other is Brush) {
            this.brush = other
            other.movable = this
            return
        } else if (other is Paintable && this is Brush) {
            other.brush = this
            this.movable = other
            return
        }

        // collide
        val vCollision = Vector(other.position.x - position.x, other.position.y - position.y)
        val center1 = this.center()
        val center2 = other.center()
        val distance = Math.min(
            kotlin.math.sqrt(Math.pow(center2.x - center1.x, 2.0) + Math.pow(center2.y - center1.y, 2.0)),
            1.0
        )    // apply min to avoid division by 0.0
        val vCollisionNorm = vCollision.div(distance)
        val relVelocity = Vector(
            velocity.x * speed - other.velocity.x * other.speed,
            velocity.y * speed - other.velocity.y * other.speed
        )

        val speed = Math.min(Math.abs(relVelocity.x * vCollisionNorm.x + relVelocity.y * vCollisionNorm.y), 2.0)
        val impulse = 2.0 * speed / (weight + other.weight)
        val newVelocity =
            Vector(vCollisionNorm.x, vCollisionNorm.y).mul(impulse * Math.min(weight, 1.0)).div(speed)
                .snapToMax(2.0)
        val newOtherVelocity =
            Vector(vCollisionNorm.x, vCollisionNorm.y).mul(impulse * Math.min(other.weight, 1.0)).div(other.speed)
                .snapToMax(2.0)
        velocity.subtract(newVelocity)
        other.velocity.add(newOtherVelocity)
    }
}