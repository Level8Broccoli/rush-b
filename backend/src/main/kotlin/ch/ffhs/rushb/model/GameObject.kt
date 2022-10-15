package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.Serializable

abstract class GameObject(
    val color: String,
) : Serializable, Movable {
    var score: Int = 0
}