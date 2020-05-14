// THIS WAS HIGHLY INSPIRED BY:
//   https://github.com/ssusnic/Machine-Learning-Flappy-Bird/blob/master/source/genetic.js

class GeneticAlgorithm {
  constructor({ game, maxUnits, topUnits }) {
    this.game = game

    this.maxUnits = maxUnits
    this.topUnits = topUnits

    this.rockets = []
    this.brains = []

    this.initData()
    this.initListeners()
  }

  /* -------------------------------------------------------------------------- */
  /*                                INTERNAL DATA                               */
  /* -------------------------------------------------------------------------- */
  initData = () => {
    this.iteration = 1
    this.mutateRate = 1
    this.fittest = null
  }

  initListeners = () => {
    this.iterProxy = Helper.listen(this, 'iteration', (value) => {
      DOMChanger.setGeneration(value)
    })

    this.fitProxy = Helper.listen(this, 'fittest', (value) => {
      DOMChanger.setFittestDOM(value)
    })
  }

  /* -------------------------------------------------------------------------- */
  /*                                   ROCKETS                                  */
  /* -------------------------------------------------------------------------- */
  initRockets = () => {
    this.filterGroup = Body.nextGroup(true)

    // spawn in "maxUnit" amount of rockets
    for (let i = 0; i < this.maxUnits; i++)
      this.rockets.push(
        new Rocket({
          game: this.game,
          x: ROCKET_SPAWN_X,
          y: ROCKET_SPAWN_Y,
          filter: this.filterGroup,
          rotation: ROCKET_SPAWN_ROT,
          velocity: {
            x: ROCKET_SPAWN_VEL_X,
            y: ROCKET_SPAWN_VEL_Y
          }
        })
      )
  }

  resetRockets = () => {
    this.rockets.forEach((rocket) => {
      rocket.reset()
    })
  }

  /* -------------------------------------------------------------------------- */
  /*                              LOOPS AND UPDATES                             */
  /* -------------------------------------------------------------------------- */
  update = (delta) => {
    if (this.actives === 0) {
      this.iterProxy.iteration = ++this.iteration
      this.game.removeFocus()
      this.evolveBrains()
      this.resetRockets()
    }

    this.rockets.forEach((rocket) => rocket.update(delta))

    this.updateBestRocket()
  }

  updateBestRocket = () => {
    const index = Helper.argMax(this.rockets.map((r) => r.fitness))
    const rocket = this.rockets[index]
    rocket.notifyAsBest()
  }

  draw = () => {
    this.rockets.forEach((rocket) => rocket.draw())
  }

  /* -------------------------------------------------------------------------- */
  /*                                 ALGORITHMS                                 */
  /* -------------------------------------------------------------------------- */
  createBrains = () => {
    this.brains.splice(0, this.brains.length)

    for (let i = 0; i < this.maxUnits; i++) {
      const rocket = this.rockets[i]
      const newBrain = new synaptic.Architect.Perceptron(
        INPUT_SIZE,
        HIDDEN_NEURONS,
        4
      )
      newBrain.index = i

      rocket.reset()
      rocket.registerBrain(newBrain)

      this.brains.push(newBrain)
    }
  }

  evolveBrains = () => {
    const winners = this.selection()

    this.fitProxy.fittest = winners[0].gameObject.fitness

    if (this.mutateRate === 1 && winners[0].gameObject.fitness < 0) {
      console.log('Brains too weak to evolve.')
      this.createBrains()
    } else {
      this.mutateRate = MUTATE_RATE
    }

    for (let i = winners.length; i < this.maxUnits; i++) {
      let offspring

      if (i < this.topUnits + TOP_WINNERS_COUNT) {
        // if within topUnits + count, crossover between parents
        const parentA = winners[0].toJSON()
        const parentB = winners[1].toJSON()
        offspring = this.crossOver(parentA, parentB)
      } else if (i < this.maxUnits - CROSSOVER_WINNER_COUNT) {
        // if within maxUnits - count, crossover between two random winners
        const parentA = this.getRandomBrain(winners).toJSON()
        const parentB = this.getRandomBrain(winners).toJSON()
        offspring = this.crossOver(parentA, parentB)
      } else {
        // clone from a random winner
        offspring = this.getRandomProbBrain(winners).toJSON()
      }

      offspring = this.mutation(offspring)

      const newBrain = synaptic.Network.fromJSON(offspring)

      this.brains[i].gameObject.registerBrain(newBrain)
      this.brains[i] = newBrain
    }

    this.brains.sort((a, b) => a.index - b.index)
  }

  selection = () => {
    // sort by descending order
    const sortedBrains = this.brains.sort(
      (a, b) => b.gameObject.fitness - a.gameObject.fitness
    )

    let count = 0
    for (let i = 0; i < sortedBrains.length; i++) {
      const brain = sortedBrains[i]
      if (brain.gameObject.state === LANDED_STATE) count++
      else break
    }

    // only return the top units
    return sortedBrains.slice(0, count > this.topUnits ? count : this.topUnits)
  }

  crossOver = (parentA, parentB) => {
    const cutPoint = Helper.randomInt(0, parentA.neurons.length - 1)
    for (let i = cutPoint; i < parentA.neurons.length; i++) {
      // if (Helper.randomInt(0, 1) === 1) {
      const biasFromParentA = parentA.neurons[i].bias
      parentA.neurons[i].bias = parentB.neurons[i].bias
      parentB.neurons[i].bias = biasFromParentA
      // }
    }

    return Helper.randomInt(0, 1) === 1 ? parentA : parentB
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

  /* -------------------------------------------------------------------------- */
  /*                                   OTHERS                                   */
  /* -------------------------------------------------------------------------- */
  restart = () => {
    this.fitProxy.fittest = -1
    this.iterProxy.iteration = 1

    this.initData()
    this.resetRockets()
    this.createBrains()
  }

  getRandomBrain = (array) => {
    return array[Helper.randomInt(0, array.length - 1)]
  }

  getRandomProbBrain = (array) => {
    const totalFitness = array.reduce((acc, cur) => {
      return acc + cur.gameObject.fitness
    })

    const normalizedWinners = array.map((winner) => {
      return {
        brain: winner,
        prob: winner.gameObject.fitness / totalFitness
      }
    })

    const winner = Math.random()
    let threshold = 0
    for (let i = 0; i < normalizedWinners.length; i++) {
      threshold += normalizedWinners[i].prob
      if (threshold > winner) {
        return normalizedWinners[i].brain
      }
    }

    return normalizedWinners[0].brain
  }

  get actives() {
    return this.rockets.filter((rocket) => rocket.state === REGULAR_STATE)
      .length
  }
}
