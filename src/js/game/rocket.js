class Rocket {
  constructor({ x, y, size, filter }) {
    this.size = size

    this.state = REGULAR_STATE

    this.decisions = [this.thrust, this.rotateLeft, this.rotateRight, () => {}]

    this.initBody(x, y, filter)
  }

  initBody = (x, y, filter) => {
    this.bodies = getRocketBody(x, y, this.size, this.size, filter)
    this.bodies.rocket.gameObject = this // back reference

    World.add(engine.world, [this.bodies.fire, this.bodies.rocket])
  }

  /* -------------------------------------------------------------------------- */
  /*                                   UPDATES                                  */
  /* -------------------------------------------------------------------------- */
  update = () => {
    this.checkStatus()
    this.useBrain()
    this.updateVisuals()
    this.updateStats()
    this.updateViewport()
  }

  updateVisuals = () => {}

  updateStats = () => {}

  updateViewport = () => {}

  checkStatus = () => {}

  /* -------------------------------------------------------------------------- */
  /*                                   ACTIONS                                  */
  /* -------------------------------------------------------------------------- */
  interact = (part, obstacle) => {
    if (!Helper.isRocketFoot(part)) {
      this.crash()
      return
    }

    const angleDiff = Helper.toDegrees(
      Helpers.normalizeAngle(Math.abs(part.angle - obstacle.angle))
    )
  }

  thrust = () => {}

  rotateLeft = () => {}

  rotateRight = () => {}

  land = () => {}

  crash = () => {}

  /* -------------------------------------------------------------------------- */
  /*                              GENETIC ALGORITHM                             */
  /* -------------------------------------------------------------------------- */
  registerBrain = (brain) => {
    this.brain = brain
  }

  calculateInputs = () => {}

  useBrain = () => {
    const inputs = this.calculateInputs()
    const outputs = this.brain.activate(inputs)
    const decision = Helpers.argMax(outputs)

    this.decisions[decision]()
  }
}
