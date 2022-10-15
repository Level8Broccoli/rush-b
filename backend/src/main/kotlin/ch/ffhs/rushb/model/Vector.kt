package ch.ffhs.rushb.model

import java.lang.Math.sqrt

class Vector(
    var x: Double,
    var y: Double
) {

    fun get(): Vector {
        return Vector(x, y)
    }

    fun mul(d: Double): Vector {
        return Vector(x * d, y * d)
    }

    fun div(d: Double): Vector {
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

    override fun toString(): String {
        return "(x: " + x + ", y: " + y + ")"
    }
}