package ch.ffhs.rushb.model

data class CharacterDto (
    val id : String,
    val color: String,
    var position: VectorDto
    ) {
    val width: Double = 8.0
    val height: Double = 32.0
    var state : CharacterState = CharacterState.IDLE
    var orientation: CharacterOrientation = CharacterOrientation.FACE
    val score: Int = 0
    val yVelocityInitial: Double = 0.0
    var velocity: VectorDto = VectorDto(0.0, yVelocityInitial)
    val weight: Double = 0.25
    val jumpForce: Double = 2.0
    val speed: Double = 8.0


    override fun toString(): String {
        return "{\"id\": \"" + id +
                "\", \"color\": \"" + color+
                "\", \"width\": " + width +
                ", \"height\": " + height +
                ", \"x\": " + position.x +
                ", \"y\": " + position.y +
                ", \"score\": " + score +
                ", \"state\": \"" + state +
                "\", \"orientation\": \"" + orientation +
                "\"}";
    }

    fun top(): Double {
        return position.y
    }

    fun bottom(): Double {
        return position.y + height
    }

    fun left(): Double {
        return position.x
    }

    fun right(): Double {
        return position.x + width
    }
}