package ch.ffhs.rushb.model

import java.lang.Math.sqrt

class Vector(
    var x: Double,
    var y: Double
) {

    fun get(): Vector {
        return Vector(x, y)
    }

    fun snapToMax(d: Double): Vector {
        return Vector(x.coerceAtMost(d), y.coerceAtMost(d))     // clamp to avoid shooting characters out of game
    }

    fun getGridValue(): Vector {
        return Vector(x / 16.0, y / 16.0)
    }

    fun mul(d: Double): Vector {
        return Vector(x * d, y * d)
    }

    fun div(d: Double): Vector {
        if (d == 0.0) {
            return this     // avoid division by 0
        }
        return Vector(x / d, y / d)
    }

    fun add(v: Vector) {
        this.x += v.x
        this.y += v.y
    }

    fun subtract(v: Vector) {
        this.x -= v.x
        this.y -= v.y
    }

    fun magnitude(): Double {
        return sqrt(x * x + y * y)
    }
}