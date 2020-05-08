class GeneticAlgorithm {
  constructor({ maxUnits, topUnits }) {
    this.maxUnits = maxUnits
    this.topUnits = topUnits

    this.brains = []

    this.reset()
  }

  reset = () => {
    this.iteration = 1
    this.mutateRate = 1
  }

  createBrains = () => {
    this.brains.splice(0, this.brains.length)

    for (let i = 0; i < this.maxUnits; i++) {
      const newBrain = new synaptic.Architect.Perceptron(3, 6, 4)

      newBrain.index = i
      newBrain.isWinner = false

      this.brains.push(newBrain)
    }
  }

  evolvePopulation = () => {
    const winners = this.selection()
  }
}
