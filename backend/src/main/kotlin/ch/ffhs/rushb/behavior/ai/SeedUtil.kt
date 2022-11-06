package ch.ffhs.rushb.behavior.ai

import ch.kaiki.nn.data.NNSerializer
import ch.kaiki.nn.neuralnet.NeuralNetwork
import java.nio.file.Files
import java.nio.file.Paths

class SeedUtil {

    fun getSeed(): NeuralNetwork {
        return NeuralNetwork.Builder(14, 12, 3).build()
    }

    fun serializeToTempDirectory(neuralNetwork: NeuralNetwork) {
        NNSerializer.serializeToTempDirectory(neuralNetwork)
    }

    fun serialize(neuralNetwork: NeuralNetwork, path: String, addTimeStamp: Boolean) {
        NNSerializer.serialize(neuralNetwork, path, addTimeStamp)
    }

    fun deserializeNeuralNetwork(path: String): NeuralNetwork {
        return NNSerializer.deserializeNeuralNetwork(path)
    }

    fun load(): NeuralNetwork {
        val projectDirAbsolutePath = Paths.get("").toAbsolutePath().toString()
        val resourcesPath = Paths.get(projectDirAbsolutePath, "/backend/src/main/resources/NeuralNetwork.ser")
        return deserializeNeuralNetwork(resourcesPath.toString())
    }

}

