package ch.ffhs.rushb.model

import java.lang.Math.sqrt

abstract class GameObject (
    open val id : String,
    open val color: String,
    open var position: Vector
    ) {
    open var width: Double = 0.0
    open var height: Double = 0.0
    open var state : CharacterState = CharacterState.IDLE
    open var orientation: CharacterOrientation = CharacterOrientation.FACE
    open var score: Int = 0
    open val yVelocityInitial: Double = 0.0
    open var velocity: Vector = Vector(0.0, yVelocityInitial)
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

    open fun intersects(other: GameObject) : Boolean {
        return !(other.position.x > this.position.x + this.width || other.position.x + other.width < this.position.x || other.position.y > this.position.y + this.height || other.position.y + other.height < this.position.x)
    }

    private fun center() : Vector {
        return Vector(position.x + (width/2), position.y - (height/2))
    }

    open fun collide(other: GameObject) {

        // source: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
        val vCollision = Vector(other.velocity.x*other.speed - this.velocity.x * this.speed, other.velocity.y * other.speed - this.velocity.y * this.speed)
        val center1 = this.center()
        val center2 = other.center()
        val distance = kotlin.math.sqrt((center2.x - center1.x) * (center2.x - center1.x) + (center2.y - center1.y) * (center2.y - center1.y))
        val vCollisionNorm = Vector(vCollision.x / distance, vCollision.y / distance)
        val relVelocity = Vector(this.velocity.x * this.speed - other.velocity.x * other.speed, this.velocity.y * this.speed - other.velocity.y * other.speed)
        val speed = relVelocity.x * vCollisionNorm.x + relVelocity.y * vCollisionNorm.y
        this.velocity.subtract(Vector(vCollisionNorm.x * speed / this.speed, vCollisionNorm.y * speed / this.speed))
        other.velocity.add(Vector(vCollisionNorm.x * speed / other.speed, vCollisionNorm.y * speed / other.speed))

        //println("colliding: " + this.id + " and " + other.id + ", vCollisionNorm: " + vCollisionNorm + " my vel: " + this.velocity.toString())
    }


}