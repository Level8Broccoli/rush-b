package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.Serializable
import ch.ffhs.rushb.model.CharacterOrientation
import ch.ffhs.rushb.model.CharacterState
import ch.ffhs.rushb.model.GameObject
import ch.ffhs.rushb.model.Vector

abstract class Agent(
    val character: GameObject,
    private val level: Level
) : Serializable {

    // ---------------- MOVING BY USER INPUT ----------------

    /**
     * This method is used to change the horizontal speed of the character by user input.
     * @param x: the user input; -1.0 in left hand oriented movement, 1.0 in right hand oriented movement
     */
    fun setVelocityX(x: Double) {
        character.velocity.x = x
        if (x > 0) {
            character.orientation = CharacterOrientation.RIGHT
        } else if (x < 0) {
            character.orientation = CharacterOrientation.LEFT
        } else {
            character.orientation = CharacterOrientation.FACE
        }
    }

    /**
     * This method is used to command a jump by user input. A jump can be applied only if the character is currently standing on ground.
     */
    fun setVelocityY() {
        if (level.collidesBottom(character)) {
            character.velocity.y = -character.jumpForce
        }
    }

    // ---------------- GAME LOOP ----------------

    /**
     * This method is applied by the game loop in short time intervals, in order to create the illusion of animation. It has following tasks:
     * - collision detection
     * - applying gravity
     * - updating the character state accordingly
     */
    open fun applyGameLoop() {
        // ---------- moving ----------
        val delta = getDelta()

        move(delta)

        // ---------- updating velocity ----------
        if (delta.x == 0.0 && character.velocity.x != 0.0) {                     // if no horizontal movement possible, set velocity accordingly
            character.velocity.x = 0.0
        } else {
            character.velocity.x *= 0.25                                         // slide
            if (character.velocity.x < 0.05 && character.velocity.x > -0.05) {
                character.velocity.x = 0.0
            }
        }

        if (!level.collidesBottom(character)) {                                 // if character is not on ground
            character.velocity.y += character.weight                            // apply gravity
        } else {                                                                // if on ground
            if (character.velocity.y > character.yVelocityInitial) {           // if on ground & no jump detected
                character.velocity.y = character.yVelocityInitial               // set to initial yVelocity
            } else {
            }
        }

        // ---------- updating state & orientation ----------
        if (character.velocity.y < 0) {
            character.state = CharacterState.JUMPING
        } else if (character.velocity.y > 0) {
            character.state = CharacterState.FALLING
        } else if (character.velocity.x != 0.0) {
            character.state = CharacterState.WALKING
        } else {
            character.state = CharacterState.IDLE
            character.orientation = CharacterOrientation.FACE
        }

        // TODO: implement painting / punching state if not to be indicated otherwise

    }

    // ---------------- DETECT MOVES OF CHARACTER ----------------

    /**
     * Method to check for horizontal movement of character.
     */
    private fun getDeltaX(): Double {
        val distance: Double
        var delta = 0.0
        val velocity = character.velocity.x * character.speed

        if (character.velocity.x < 0) {          // going left
            distance = -level.getDistanceToLeft(character)
            delta = velocity.coerceAtLeast(distance)    // max
        } else if (character.velocity.x > 0) {   // going right
            distance = level.getDistanceToRight(character)
            delta = velocity.coerceAtMost(distance)     // min
        }
        return delta
    }

    /**
     * Method to check for vertical movement of character.
     */
    private fun getDeltaY(): Double {
        val distance: Double
        val delta: Double
        val velocity = character.velocity.y * character.speed

        if (character.velocity.y < 0) {      // going up
            distance = -level.getDistanceToTop(character)
            delta = velocity.coerceAtLeast(distance)    // max
            if (distance >= -0.05 && velocity < -0.05) {
                character.velocity.y = -1 * character.velocity.y                // reverse yVelocity when head was hit
            }
        } else {                            // going down
            distance = level.getDistanceToBottom(character)
            delta = velocity.coerceAtMost(distance)     // min
        }
        return delta
    }

    private fun getDelta(): Vector {
        return Vector(getDeltaX(), getDeltaY())
    }

    // ---------------- MOVING TRIGGERED BY GAME LOOP ----------------

    /**
     * Function to move characters x and y coordinate
     */
    private fun move(delta: Vector) {
        character.position.x += delta.x
        character.position.y += delta.y
    }

    /**
     * Checks if two characters intersect. If yes, collision detection is applied to change the velocity vector.
     */
    fun validateIntersect(other: Agent) {
        if (intersects(other)) {
            collide(other)
        }
    }

    private fun intersects(other: Agent): Boolean {
        val obj1 = this.character
        val obj2 = other.character
        return !(obj2.position.x > obj1.position.x + obj1.width ||
                obj1.position.x > obj2.position.x + obj2.width ||
                obj2.position.y > obj1.position.y + obj1.height ||
                obj1.position.y > obj2.position.y + obj2.height)
    }

    private fun center(): Vector {
        return Vector(character.position.x + (character.width / 2), character.position.y - (character.height / 2))
    }

    private fun collide(other: Agent) {
        val obj1 = this.character
        val obj2 = other.character

        val vCollision = Vector(obj2.position.x - obj1.position.x, obj2.position.y - obj1.position.y)
        val center1 = this.center()
        val center2 = other.center()
        val distance = Math.min(
            kotlin.math.sqrt(Math.pow(center2.x - center1.x, 2.0) + Math.pow(center2.y - center1.y, 2.0)),
            1.0
        )    // apply min to avoid division by 0.0
        val vCollisionNorm = vCollision.div(distance)
        val relVelocity = Vector(
            obj1.velocity.x * obj1.speed - obj2.velocity.x * obj2.speed,
            obj1.velocity.y * obj1.speed - obj2.velocity.y * obj2.speed
        )

        val speed = Math.min(Math.abs(relVelocity.x * vCollisionNorm.x + relVelocity.y * vCollisionNorm.y), 2.0)
        val impulse = 2.0 * speed / (obj1.weight + obj2.weight)
        val newVelocity =
            Vector(vCollisionNorm.x, vCollisionNorm.y).mul(impulse * Math.min(obj1.weight, 1.0)).div(obj1.speed)
        val newOtherVelocity =
            Vector(vCollisionNorm.x, vCollisionNorm.y).mul(impulse * Math.min(obj2.weight, 1.0)).div(obj2.speed)
        obj1.velocity.subtract(newVelocity)
        obj2.velocity.add(newOtherVelocity)
    }
}