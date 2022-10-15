package ch.ffhs.rushb.controller

import ch.ffhs.rushb.model.*

abstract class Agent(open val character: GameObject,
                 open val level: Level
) {

    // ---------------- MOVING BY USER INPUT ----------------

    /**
     * This method is used to change the horizontal speed of the character by user input.
     * @param x: the user input; -1.0 in left hand oriented movement, 1.0 in right hand oriented movement
     */
    open fun setVelocityX(x: Double) {
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
    open fun setVelocityY() {
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
        var delta = 0.0
        val velocity = character.velocity.y * character.speed

        if (character.velocity.y < 0) {      // going up
            distance = -level.getDistanceToTop(character)
            delta = velocity.coerceAtLeast(distance)    // max
            if (distance >= -0.05 && velocity < -0.05) {
                character.velocity.y =  -1 * character.velocity.y                // reverse yVelocity when head was hit
            }
        } else {                            // going down
            distance = level.getDistanceToBottom(character)
            delta = velocity.coerceAtMost(distance)     // min
        }
        return delta
    }

    fun getDelta() : Vector {
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
        // save current position
        val pos = this.character.position.get()
        val otherPos = other.character.position.get()

        // make a move
        this.move(this.getDelta())
        other.move(other.getDelta())

        // check intersection and adapt velocity if necessary
        if (intersects(other)) {
            collide(other)
        }

        // reset move
        this.character.position = pos
        other.character.position = otherPos
    }

    override fun toString(): String {
        return character.toString()
    }

    open fun intersects(other: Agent) : Boolean {
        return !(other.character.position.x > this.character.position.x + this.character.width || other.character.position.x + other.character.width < this.character.position.x || other.character.position.y > this.character.position.y + this.character.height || other.character.position.y + other.character.height < this.character.position.x)
    }

    private fun center() : Vector {
        return Vector(character.position.x + (character.width/2), character.position.y - (character.height/2))
    }

    open fun collide(other: Agent) {
        val vCollision = Vector(other.character.velocity.x - this.character.velocity.x, other.character.velocity.y - this.character.velocity.y)
        val center1 = this.center()
        val center2 = other.center()
        var distance = kotlin.math.sqrt((center2.x - center1.x) * (center2.x - center1.x) + (center2.y - center1.y) * (center2.y - center1.y))
        if (distance == 0.0) {
            distance = 1.0     // avoid division by 0
        }
        val vCollisionNorm = Vector(vCollision.x / distance, vCollision.y / distance)
        val relVelocity = Vector(this.character.velocity.x - other.character.velocity.x, this.character.velocity.y  - other.character.velocity.y)

        val speed = Math.min(Math.abs(relVelocity.x * vCollisionNorm.x + relVelocity.y * vCollisionNorm.y), 2.0)
        val newVelocity = Vector(vCollisionNorm.x * speed , vCollisionNorm.y * speed)
        val newOtherVelocity = Vector(vCollisionNorm.x * speed , vCollisionNorm.y * speed )
        this.character.velocity.add(newVelocity)
        other.character.velocity.subtract(newOtherVelocity)

    }


}