package ch.ffhs.rushb.model

import java.lang.Math.sqrt

class Vector(
    var x: Double,
    var y: Double
) {
    fun add(v: Vector) {
        this.x += v.x;
        this.y += v.y;
    }

    fun subtract(v: Vector) {
        this.x -= v.x;
        this.y -= v.y;
    }

    fun magnitude(): Double {
        return sqrt(x*x + y*y)
    }
}