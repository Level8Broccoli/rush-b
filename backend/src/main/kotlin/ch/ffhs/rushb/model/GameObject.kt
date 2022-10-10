package ch.ffhs.rushb.model

abstract class GameObject (
    open val id : String,
    open val color: String,
    open var position: VectorDto
    ) {
    open var width: Double = 0.0
    open var height: Double = 0.0
    open var state : CharacterState = CharacterState.IDLE
    open var orientation: CharacterOrientation = CharacterOrientation.FACE
    open var score: Int = 0
    open val yVelocityInitial: Double = 0.0
    open var velocity: VectorDto = VectorDto(0.0, yVelocityInitial)
    open var weight: Double = 0.0
    open var jumpForce: Double = 0.0
    open var speed: Double = 0.0


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

    open fun top(): Double {
        return position.y
    }

    open fun bottom(): Double {
        return position.y + height
    }

    open fun left(): Double {
        return position.x
    }

    open fun right(): Double {
        return position.x + width
    }
}