package ch.ffhs.rushb.behavior.ai

import ch.kaiki.nn.genetic.GeneticBatch
import ch.kaiki.nn.neuralnet.NeuralNetwork
import kotlin.concurrent.thread

/**
 * This class is used to train a new neural network (which would be the core for the DeepBot).
 * The training will be executed in a separate thread. The result will be saved as serialized
 * neural network to your temp folder (full path will be printed to log).
 * If the file is to be used, please remove the timestamp and move it to the resources folder.
 */
class GeneticFitter {

    private val populationSize = 1000;
    private val generationCount = 20;
    private var seed = SeedUtil().getSeed()

    private val batch: GeneticBatch<MockGame, NeuralNetwork> = GeneticBatch<MockGame, NeuralNetwork>(
        MockGame(seed).javaClass, seed.javaClass, seed, populationSize);

    fun run() {
        thread {
            for (i in 0 until generationCount) {
                seed = batch.processGeneration() as NeuralNetwork;
            }
            SeedUtil().serializeToTempDirectory(batch.bestGene as NeuralNetwork)
        }

    }
}

