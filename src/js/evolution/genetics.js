// THIS WAS HIGHLY INSPIRED BY:
//   https://github.com/ssusnic/Machine-Learning-Flappy-Bird/blob/master/source/genetic.js

class GeneticAlgorithm {
  constructor({ game, maxUnits, topUnits }) {
    this.game = game

    this.maxUnits = maxUnits
    this.topUnits = topUnits

    this.rockets = []
    this.brains = []

    this.reset()
    this.initRockets()
  }

  reset = () => {
    this.iteration = 1
    this.mutateRate = 1
  }

  initRockets = () => {
    // spawn in "maxUnit" amount of rockets
    for (let i = 0; i < this.maxUnits; i++)
      this.rockets.push(
        new Rocket({
          game: this.game,
          x: ROCKET_SPAWN_X,
          y: ROCKET_SPAWN_Y,
          filter: Body.nextGroup(true)
        })
      )
  }

  createBrains = () => {
    this.brains.splice(0, this.brains.length)

    for (let i = 0; i < this.maxUnits; i++) {
      const rocket = this.rockets[i]
      const newBrain = new synaptic.Architect.Perceptron(3, 6, 4)
      newBrain.index = i

      rocket.reset()
      rocket.registerBrain(newBrain)

      this.brains.push(newBrain)
    }
  }

  evolveBrains = () => {
    const winners = this.selection()

    if (this.mutateRate === 1 && winners[0].gameObject.fitness < 0) {
      this.createBrains()
    } else {
      this.mutateRate = 0.2
    }

    for (let i = 0; i < this.maxUnits; i++) {
      let offspring

      if (i === this.topUnits) {
        const parentA = winners[0].toJSON()
        const parentB = winners[1].toJSON()
        offspring = this.crossOver(parentA, parentB)
      } else if (i < this.maxUnits - 2) {
        const parentA = this.getRandomBrain(winners).toJSON()
        const parentB = this.getRandomBrain(winners).toJSON()
        offspring = this.crossOver(parentA, parentB)
      } else {
        offspring = this.getRandomBrain(winners).toJSON()
      }

      offspring = this.mutation(offspring)

      const newBrain = synaptic.Network.fromJSON(offspring)
      this.rockets[i].registerBrain(newBrain)

      this.brains[i] = newBrain
    }

    this.brains.sort((a, b) => a.index - b.index)
  }

  selection = () => {
    // sort by descending order
    const sortedBrains = this.brains.sort(
      (a, b) => b.gameObject.fitness - a.gameObject.fitness
    )

    // only return the top units
    return sortedBrains.slice(0, this.topUnits)
  }

  crossOver = (parentA, parentB) => {
    const cutPoint = Helper.randomInt(0, parentA.neurons.length - 1)

    for (let i = cutPoint; i < parentA.neurons.length; i++) {
      const biasFromParentA = parentA.neurons[i].bias
      parentA.neurons[i].bias = parentB.neurons[i].bias
      parentB.neurons[i].bias = biasFromParentA
    }

    return Helper.randomInt(0, 1) == 1 ? parentA : parentB
  }

  mutation = (offspring) => {
    offspring.neurons.forEach((neuron) => {
      neuron.bias = this.mutate(neuron.bias)
    })

    offspring.connections.forEach((connection) => {
      connection.weight = this.mutate(connection.weight)
    })

    return offspring
  }

  mutate = (gene) => {
    if (Math.random() < this.mutateRate) {
      const mutateFactor = 1 + ((Math.random() - 0.5) * 3 + Math.random() - 0.5)
      gene *= mutateFactor
    }

    return gene
  }

  getRandomBrain = (array) => {
    return array[Helper.randomInt(0, array.length - 1)]
  }
}
