package ch.ffhs.rushb.behavior.ai

import ch.kaiki.nn.data.NNSerializer
import ch.kaiki.nn.neuralnet.NeuralNetwork
import java.nio.file.Paths

/**
 * This util class helps handling the creation, loading and saving of neural networks.
 */
class SeedUtil {

    /**
     * Creates a new neural network according to the wished configuration.
     * This configuration serves as single source of truth, so it can be ensured that the
     * architecture of the neural network remains constant.
     * @return the neural network
     */
    fun getSeed(): NeuralNetwork {
        return NeuralNetwork.Builder(14, 12, 3).build()
    }

    /**
     * This method will serialize the neural network to the local temp directory.
     * @param neuralNetwork the neural network
     */
    fun serializeToTempDirectory(neuralNetwork: NeuralNetwork) {
        NNSerializer.serializeToTempDirectory(neuralNetwork)
    }

    /**
     * This method will serialize the neural network to a directory of choice.
     * @param neuralNetwork the neural network
     * @param path the saving path as string
     * @param addTimeStamp indicator if the timestamp should be added to the file name
     */
    fun serialize(neuralNetwork: NeuralNetwork, path: String, addTimeStamp: Boolean) {
        NNSerializer.serialize(neuralNetwork, path, addTimeStamp)
    }

    /**
     * This method loads a serialized neural network from a serialized file
     * @param path the loading path as string
     * @return the neural network
     */
    fun deserializeNeuralNetwork(path: String): NeuralNetwork {
        return NNSerializer.deserializeNeuralNetwork(path)
    }

    /**
     * This method loads a serialized neural network from the resources directory.
     * @return the neural network
     */
    fun load(): NeuralNetwork {
        val projectDirAbsolutePath = Paths.get("").toAbsolutePath().toString()
        val resourcesPath = Paths.get(projectDirAbsolutePath, "/backend/src/main/resources/NeuralNetwork.ser")
        return deserializeNeuralNetwork(resourcesPath.toString())
    }

}

