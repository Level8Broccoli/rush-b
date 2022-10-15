package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.Serializable
import ch.ffhs.rushb.enums.Color

abstract class GameObject(
    override val color: Color,
) : Serializable, Movable {
    var score: Int = 0
}