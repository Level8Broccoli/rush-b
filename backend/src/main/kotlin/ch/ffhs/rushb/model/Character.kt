package ch.ffhs.rushb.model

class Character (
    id : String,
    color: String,
    position: VectorDto
) : GameObject (id, color, position)

{
    init {
        width = 10.0
        height = 28.0
        weight = 0.25
        jumpForce = 2.0
        speed = 12.0
    }
}
