package ch.ffhs.rushb.model

data class CharacterDto (
    val id : String,
    val color: String,
    val score: Int,
    val level: TileMap = TileMap.ONE,
    var x: Double,
    var y: Double,
    var state : CharacterState = CharacterState.IDLE,
    var orientation: CharacterOrientation = CharacterOrientation.FACE,
    val width: Double = 16.0,
    val height: Double = 16.0,
    var xVelocity: Double = 0.0,
    val yVelocityInitial: Double = 1.0,
    var yVelocity: Double = yVelocityInitial,
    val weight: Double = 0.25,
    val jumpForce: Double = 0.25,
    val speed: Double = 2.0
    ) {

    fun top(): Double {
        return y
    }

    fun bottom(): Double {
        return y + height
    }

    fun left(): Double {
        return x
    }

    fun right(): Double {
        return x + width
    }
}