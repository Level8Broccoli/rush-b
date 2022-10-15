package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.INITIAL_VELOCITY
import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.Serializable

class Npc(
    override val id: String,
    color: String,
    override var position: Vector,
) : GameObject(color), Serializable, Movable {
    override var orientation = Orientation.FACE
    override var velocity = Vector(0.0, INITIAL_VELOCITY.y)
    override var width = 8.0
    override var height = 8.0
    override var weight = 0.25
    override var jumpForce = 1.0
    override var speed = 4.0
    override var state = CharacterState.IDLE

    override fun toJSON(): String {
        return "{\"id\": \"" + id +
                "\", \"color\": \"" + color +
                "\", \"width\": " + width +
                ", \"height\": " + height +
                ", \"x\": " + position.x +
                ", \"y\": " + position.y +
                ", \"state\": \"" + state +
                "\", \"orientation\": \"" + orientation +
                "\"}"
    }
}