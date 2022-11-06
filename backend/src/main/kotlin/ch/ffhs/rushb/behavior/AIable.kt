package ch.ffhs.rushb.behavior

import ch.ffhs.rushb.controller.Level
import ch.kaiki.nn.neuralnet.NeuralNetwork
import ch.kaiki.nn.util.NetUtils

interface AIable {
    var neuralNetwork: NeuralNetwork
    var fitness: Int

    fun predict(level: Level, gameObject: MutableList<Movable>) {
        if (!(this is Movable)) {
            return
        }

        val offset = 16.0
        val center = this.center()
        val x = center.x
        val y = center.y

        val vision = doubleArrayOf(
            0.0,0.0,0.0,0.0,    // colliding with walls
            0.0,0.0,0.0,0.0,    // near other character
            0.0,0.0,0.0,0.0,    // near brush
            0.0,0.0,0.0,0.0,    // near npc
            0.0                 // has brush
        )
        if (level.collidesTop(this)) {
            vision[0] = 1.0
        }
        if (level.collidesRight(this)) {
            vision[1] = 1.0
        }
        if (level.collidesBottom(this)) {
            vision[2] = 1.0
        }
        if (level.collidesLeft(this)) {
            vision[3] = 1.0
        }
        for (obj in gameObject) {
            if (obj == this) {
                continue
            }

            val centerObj = obj.center()
            val xObj = centerObj.x
            val yObj = centerObj.y

            if (obj is Paintable) {         // character
                if (yObj <= y && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[4] = 1.0
                }
                if (xObj >= x && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[5] = 1.0
                }
                if (yObj >= y && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[6] = 1.0
                }
                if (xObj <= x && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[7] = 1.0
                }
            } else if (obj is Grabbable) {  // brush
                if (yObj <= y && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[8] = 1.0
                }
                if (xObj >= x && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[9] = 1.0
                }
                if (yObj >= y && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[10] = 1.0
                }
                if (xObj <= x && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[11] = 1.0
                }
            } else {                        // npc
                if (yObj <= y && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[12] = 1.0
                }
                if (xObj >= x && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[13] = 1.0
                }
                if (yObj >= y && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[14] = 1.0
                }
                if (xObj <= x && Math.abs(yObj-y) <= offset && Math.abs(xObj-x) <= offset) {
                    vision[15] = 1.0
                }
            }
        }

        if (this is Paintable && this.brush != null) {
            vision[16] = 1.0
        }

        val prediction = NetUtils.getMaxindex(neuralNetwork.predict(vision))

        if (prediction == 0) {
            this.setVelocityX(-1.0)
        } else if (prediction == 1) {
            this.setVelocityX(1.0)
        } else if (prediction == 2) {
            this.setVelocityY(level)
        }
    }


}