package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.Serializable

class Npc(
    id: String,
    color: String,
    position: Vector,
) : GameObject(id, color, position), Serializable {
    init {
        width = 8.0
        height = 8.0
        weight = 0.25
        jumpForce = 1.0
        speed = 4.0
    }

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