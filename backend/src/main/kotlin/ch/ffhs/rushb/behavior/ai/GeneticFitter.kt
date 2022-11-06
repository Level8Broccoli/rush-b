package ch.ffhs.rushb.behavior.ai

import ch.kaiki.nn.genetic.GeneticBatch
import ch.kaiki.nn.neuralnet.NeuralNetwork


class GeneticFitter {

    var seed = SeedUtil().getSeed()
    var populationSize = 1000;
    var generationCount = 10;
    var x = MockGame(seed)
    var batch: GeneticBatch<MockGame, NeuralNetwork> = GeneticBatch<MockGame, NeuralNetwork>(
        MockGame(seed).javaClass, seed.javaClass, seed, populationSize);

    fun run() {
        println("genetic algorithm started")
        for (i in 0 until generationCount) {
            seed = batch.processGeneration() as NeuralNetwork;
        }
        println("genetic algorithm stopped")
        SeedUtil().serializeToTempDirectory(batch.bestGene as NeuralNetwork)
    }
}

