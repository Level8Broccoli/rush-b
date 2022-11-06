package ch.ffhs.rushb.behavior

import ch.ffhs.rushb.controller.Level
import ch.kaiki.nn.neuralnet.NeuralNetwork
import ch.kaiki.nn.util.NetUtils

/**
 * This interface acts as component for ai related behavior.
 * It holds a neural network as 'brain', which will be used to predict the velocity
 * for the next step. Furthermore, it contains tracking properties so the
 * success of the bot is possible to rate.
 */
interface AIable {
    var neuralNetwork: NeuralNetwork
    var fitness: Long
    var visitedTiles: MutableList<String>

    /**
     * With this method, the 'vision' of the bot is constructed as vector, which is fed to the
     * neural network to obtain a prediction of the next action.
     * The prediction is then evaluated so the next action of the bot can be determined.
     * @param level the level to be played
     * @param gameObjects the list of all game objects (characters, bots, npcs, brushes)
     */
    fun predict(level: Level, gameObjects: MutableList<Movable>) {
        if (!(this is Movable)) {
            return
        }

        val offset = 16.0
        val center = this.center()
        val x = center.x
        val y = center.y

        // ---------------- COLLECT VISION VECTOR ----------------

        val vision = doubleArrayOf(
            0.0,0.0,0.0,0.0,    // colliding with walls
            0.0,0.0,0.0,0.0,    // near brush
            0.0,                // has brush
            0.0,                // tile already visited
            0.0,0.0,            // velocity
            0.0,0.0             // position
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
        for (obj in gameObjects) {
            if (obj == this) {
                continue
            }

            val centerObj = obj.center()
            val xObj = centerObj.x
            val yObj = centerObj.y

            if (obj is Grabbable) {  // brush
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
            }
        }

        if (this is Paintable && this.brush != null) {
            vision[8] = 1.0
        }

        val tile = (x / 16).toInt().toString() + " " + (y / 16).toInt().toString()
        if (visitedTiles.contains(tile)) {
            vision[9] = 1.0
        } else {
            visitedTiles.add(tile)
        }

        if (Math.abs(this.velocity.x) > 0) {
            vision[10] = 1.0
        }

        if (Math.abs(this.velocity.y) > 0) {
            vision[11] = 1.0
        }

        if (x >= 0) {
            vision[12] = (x / 16 / level.tiles.size)
        }
        if (y >= 0) {
            vision[13] = (y / 16 / level.tiles[0].size)
        }

        // ---------------- PREDICT ACTION ----------------

        val prediction = NetUtils.getMaxindex(neuralNetwork.predict(vision))

        // ---------------- EVALUATE PREDICITION ----------------

        if (prediction == 0) {
            this.setVelocityX(-1.0)
        } else if (prediction == 1) {
            this.setVelocityX(1.0)
        } else if (prediction == 2) {
            this.setVelocityY(level)
        }
        (this as Paintable).paint(level)
    }


}