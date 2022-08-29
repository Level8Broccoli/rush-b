package ch.ffhs.rushb.model

import ch.ffhs.rushb.model.todo.LevelDto

data class CharacterDto (
    val id : String,
    val color: String,
    val score: Int,
    val level: LevelDto,
    var x: Double,
    var y: Double,
    var state : CharacterState = CharacterState.IDLE,
    var orientation: CharacterOrientation = CharacterOrientation.FACE,
    val width: Double = 16.0,
    val height: Double = 16.0,
    var xVelocity: Double = 0.0,
    var yVelocity: Double = -1.0,
    val weight: Double = 0.25,
    val jumpForce: Double = 0.25,
    val speed: Double = 10.0
    )