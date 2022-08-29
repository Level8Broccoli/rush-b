package ch.ffhs.rushb.controller

import ch.ffhs.rushb.model.CharacterDto
import ch.ffhs.rushb.model.CharacterOrientation
import ch.ffhs.rushb.model.CharacterState

class Player (private val character: CharacterDto) {

    // ---------------- MOVING BY USER INPUT ----------------

    /**
     * This method is used to change the horizontal speed of the character by user input.
     * @param x: the user input; negative results in left hand oriented movement, positive in right hand oriented movement
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
        if (true) {     // TODO: check if character is standing on ground to apply jump
            character.yVelocity = -character.jumpForce
        }
    }

    // ---------------- COLLISION DETECTION ----------------

    /**
     * This method is applied by the game loop in short time intervals, in order to create the illusion of animation. It has following tasks:
     * - collision detection
     * - applying gravity
     * - updating the character state accordingly
     */
    fun applyGameLoop() {
        if (true) {         // TODO: check if character has no ground underneath --> falling into the void
            move(character.xVelocity * character.speed, character.yVelocity * character.speed)
            character.yVelocity += character.weight
        } else {
            if (true) {     // TODO: check for collision on left side and xVelocity < 0 (stop if hit wall on left and walking)
                character.xVelocity = 0.0
            }
            if (true) {     // TODO: check for collision on right side and xVelocity > 0 (stop if hit wall on right and walking)
                character.xVelocity = 0.0
            }
            if (true) {     // TODO: check if character is on ground
                if (character.yVelocity < 0) {  // jump detected
                    move(character.xVelocity * character.speed, character.yVelocity * character.speed)
                } else {    // on ground
                    move(character.xVelocity * character.speed, 0.0)
                    character.yVelocity = 1.0
                }
            } else {        // jump handling
                val yDistance: Double
                val velocity = character.yVelocity * character.speed
                val yDelta: Double
                if (character.yVelocity < 0) {
                    yDistance = 0.0 // TODO: get negative of distance to the top
                    yDelta = Math.max(velocity, yDistance)
                    if (yDelta == yDistance) {
                        character.yVelocity = 1 + character.weight
                    }
                } else {
                    yDistance = 0.0 // TODO: get distance to bottom
                    yDelta = Math.min(velocity, yDistance)
                }
                move(character.xVelocity * character.speed, yDelta)
                character.yVelocity += character.weight
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

    // ---------------- MOVING TRIGGERED BY GAME LOOP ----------------

    // game loop will apply this function, in order to get walks, jumps and falls animated
    private fun move(x: Double, y: Double) {
        character.x += x
        character.y += y
        if (false) {    // TODO: check if character is below ground level
            // TODO: set dead
        }
    }

    // ---------------- BOUNDING BOX ----------------

    private fun getTop(): Double {
        return character.x + character.height
    }

    private fun getBottom(): Double {
        return character.x
    }

    private fun getLeft(): Double {
        return character.y
    }

    private fun getRight(): Double {
        return character.y + character.width
    }

}