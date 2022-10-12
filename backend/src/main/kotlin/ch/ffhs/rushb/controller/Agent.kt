package ch.ffhs.rushb.controller

import ch.ffhs.rushb.model.*
import kotlin.math.abs

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
        val x_delta = getDeltaX()
        val y_delta = getDeltaY()

        move(x_delta, y_delta)

        // ---------- updating velocity ----------
        if (x_delta == 0.0 && character.velocity.x != 0.0) {                     // if no horizontal movement possible, set velocity accordingly
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

    // ---------------- MOVING TRIGGERED BY GAME LOOP ----------------

    /**
     * Function to move characters x and y coordinate
     */
    private fun move(x: Double, y: Double) {
        character.position.x += x
        character.position.y += y
        if (level.isBelowGroundLevel(character)) {
            // TODO: set dead
        }
    }

}