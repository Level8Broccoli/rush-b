package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.Serializable

class Character(
    id: String,
    color: String,
    position: Vector,
) : GameObject(id, color, position), Serializable {
    init {
        width = 10.0
        height = 28.0
        weight = 0.75
        jumpForce = 2.0
        speed = 12.0
    }

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
