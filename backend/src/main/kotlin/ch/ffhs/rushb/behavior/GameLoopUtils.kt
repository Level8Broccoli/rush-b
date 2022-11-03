import ch.ffhs.rushb.behavior.INITIAL_VELOCITY
import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.getDelta
import ch.ffhs.rushb.controller.Level
import ch.ffhs.rushb.enums.CharacterState
import ch.ffhs.rushb.enums.Orientation
import ch.ffhs.rushb.model.Brush

// ---------------- GAME LOOP ----------------

/**
 * This method is applied by the game loop in short time intervals, in order to create the illusion of animation. It has following tasks:
 * - collision detection
 * - applying gravity
 * - updating the character state accordingly
 */
fun gameLoop(level: Level, character: Movable) {
    // ---------- moving ----------
    val delta = getDelta(level, character)

    character.move(delta)

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
        if (!(character is Brush && character.movable != null)) {
            character.velocity.y += character.weight                            // apply gravity
        }
    } else {                                                                // if on ground
        if (character.velocity.y > INITIAL_VELOCITY.y) {           // if on ground & no jump detected
            character.velocity.y = INITIAL_VELOCITY.y               // set to initial yVelocity
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
        character.orientation = Orientation.FACE
    }

    // TODO: implement painting / punching state if not to be indicated otherwise

}