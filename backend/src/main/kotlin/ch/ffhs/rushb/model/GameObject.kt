package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.Serializable

abstract class GameObject(
    val id: String,
    val color: String,
) : Serializable, Movable {
    var state: CharacterState = CharacterState.IDLE
    var score: Int = 0
}