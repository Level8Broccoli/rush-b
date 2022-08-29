package ch.ffhs.rushb.controller

import ch.ffhs.rushb.model.CharacterDto
import ch.ffhs.rushb.model.CharacterOrientation
import ch.ffhs.rushb.model.CharacterState

class Player (private val character: CharacterDto) {

    private val level = Level(character.level)

    // ---------------- MOVING BY USER INPUT ----------------

    /**
     * This method is used to change the horizontal speed of the character by user input.
     * @param x: the user input; -1.0 in left hand oriented movement, 1.0 in right hand oriented movement
     */
    fun setVelocityX(x: Double) {
        character.xVelocity = x
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
            character.yVelocity = -character.jumpForce
        }
    }

    // ---------------- GAME LOOP ----------------

    /**
     * This method is applied by the game loop in short time intervals, in order to create the illusion of animation. It has following tasks:
     * - collision detection
     * - applying gravity
     * - updating the character state accordingly
     */
    fun applyGameLoop() {
        if (level.isBelowGroundLevel(character)) {                                  // falling below ground level
            move(character.xVelocity * character.speed, character.yVelocity * character.speed)
            character.yVelocity += character.weight
        } else {
            val x_delta = getDeltaX(character)
            val y_delta = getDeltaY(character)

            move(x_delta, y_delta)

            if (x_delta == 0.0 && character.xVelocity != 0.0) {                     // if no horizontal movement possible, set velocity accordingly
                character.xVelocity = 0.0
            }

            if (!level.collidesBottom(character)) {                                 // if character is not on ground
                character.yVelocity += character.weight                             // apply gravity
            } else if (character.yVelocity >= 0) {                                  // if on ground & no jump detected
                character.yVelocity = character.yVelocityInitial                    // set to initial yVelocity
            }
        }

        if (character.yVelocity < 0) {
            character.state = CharacterState.JUMPING
        } else if (character.yVelocity > 0) {
            character.state = CharacterState.FALLING
        } else if (character.xVelocity != 0.0) {
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
    private fun getDeltaX(character: CharacterDto): Double {
        val distance: Double
        var delta = 0.0
        val velocity = character.xVelocity * character.speed

        if (character.xVelocity < 0) {          // going left
            distance = -level.getDistanceToLeft(character)
            delta = velocity.coerceAtLeast(distance)    // max
        } else if (character.xVelocity > 0) {   // going right
            distance = level.getDistanceToRight(character)
            delta = velocity.coerceAtMost(distance)     // min
        }
        return delta
    }

    /**
     * Method to check for vertical movement of character.
     */
    private fun getDeltaY(character: CharacterDto): Double {
        val distance: Double
        var delta = 0.0
        val velocity = character.yVelocity * character.speed

        if (character.yVelocity < 0) {      // going up
            distance = -level.getDistanceToTop(character)
            delta = velocity.coerceAtLeast(distance)    // max
            if (delta == distance) {
                character.yVelocity =  -1 * character.yVelocity                // reverse yVelocity when head was hit
            }
        } else {                            // going down
            distance = level.getDistanceToBottom(character)
            delta = velocity.coerceAtMost(distance)     // min
        }
        return delta
    }

    // ---------------- MOVING TRIGGERED BY GAME LOOP ----------------

    /**
     * Function to move characters x and y coordinate
     */
    private fun move(x: Double, y: Double) {
        character.x += x
        character.y += y
        if (level.isBelowGroundLevel(character)) {
            // TODO: set dead
        }
    }

}