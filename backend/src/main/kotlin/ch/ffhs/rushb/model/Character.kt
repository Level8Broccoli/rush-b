package ch.ffhs.rushb.model

class Character (
    id : String,
    color: String,
    position: VectorDto
) : GameObject (id, color, position)

{
    init {
        width = 8.0
        height = 32.0
        weight = 0.25
        jumpForce = 2.0
        speed = 8.0
    }
}
