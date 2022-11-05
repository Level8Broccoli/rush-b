package ch.ffhs.rushb.behavior

import ch.ffhs.rushb.controller.GameController
import ch.ffhs.rushb.controller.Level
import ch.kaiki.nn.neuralnet.NeuralNetwork
import ch.kaiki.nn.util.NetUtils

interface AIable {
    var neuralNetwork: NeuralNetwork
    var fitness: Long

    fun predict(level: Level, gameObject: MutableList<Movable>) {
        if (!(this is Movable)) {
            return
        }
        var vision = doubleArrayOf(1.0, 0.5)


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