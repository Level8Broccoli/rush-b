package kotlincode.ch.ffhs.rushb.behavior.ai

import ch.kaiki.nn.data.NNSerializer
import ch.kaiki.nn.neuralnet.NeuralNetwork

class SeedUtil {

    fun getSeed(): NeuralNetwork {
        return NeuralNetwork.Builder(17, 12, 3).build()
    }

    fun serializeToTempDirectory(neuralNetwork: NeuralNetwork) {
        NNSerializer.serializeToTempDirectory(neuralNetwork)
    }

    fun serialize(neuralNetwork: NeuralNetwork, path: String, addTimeStamp: Boolean) {
        NNSerializer.serialize(neuralNetwork, path, addTimeStamp)
    }

    fun deserializeNeuralNetwork(path: String) {
        NNSerializer.deserializeNeuralNetwork(path)
    }

}

