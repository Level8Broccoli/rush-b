package ch.ffhs.rushb.model

open class Npc (
    id : String,
    color: String,
    position: Vector
) : GameObject (id, color, position)

{
    init {
        width = 8.0
        height = 8.0
        weight = 0.25
        jumpForce = 1.0
        speed = 4.0
    }

    override fun toString(): String {
        return "{\"id\": \"" + id +
                "\", \"color\": \"" + color+
                "\", \"width\": " + width +
                ", \"height\": " + height +
                ", \"x\": " + position.x +
                ", \"y\": " + position.y +
                ", \"state\": \"" + state +
                "\", \"orientation\": \"" + orientation +
                "\"}";
    }
}