package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.INITIAL_VELOCITY
import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.Serializable

class Character(
    override val id: String,
    color: String,
    override var position: Vector,
) : GameObject(color), Serializable, Movable {
    override var orientation = Orientation.FACE
    override var width = 10.0
    override var height = 28.0
    override var velocity = Vector(0.0, INITIAL_VELOCITY.y)
    override var weight = 0.75
    override var jumpForce = 2.0
    override var speed = 12.0
    override var state = CharacterState.IDLE

    override fun toJSON(): String {
        return "{\"id\": \"" + id +
                "\", \"color\": \"" + color +
                "\", \"width\": " + width +
                ", \"height\": " + height +
                ", \"x\": " + position.x +
                ", \"y\": " + position.y +
                ", \"score\": " + score +
                ", \"state\": \"" + state +
                "\", \"orientation\": \"" + orientation +
                "\"}"; }
}
