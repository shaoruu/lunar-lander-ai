class Rocket {
  constructor({ game, x, y, filter }) {
    this.game = game
    this.state = REGULAR_STATE

    this.decisions = [this.thrust, this.rotateLeft, this.rotateRight, () => {}]

    this.initBody(x, y, filter)
    this.initStatus()
  }

  initBody = (x, y, filter) => {
    this.bodies = getRocketBody(x, y, ROCKET_DIM, ROCKET_DIM, filter)
    this.bodies.rocket.gameObject = this // back reference

    World.add(engine.world, [this.bodies.fire, this.bodies.rocket])
  }

  initStatus = () => {
    this.status = {
      force: 0,
      fuel: MAX_ROCKET_FUEL,
      focused: false,
      lastSpeed: 0,
      bornTime: performance.now(),
      lifetime: 0
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   UPDATES                                  */
  /* -------------------------------------------------------------------------- */
  update = () => {
    if (this.state !== REGULAR_STATE) return

    this.checkStatus()
    this.useBrain()
    this.updateVisuals()
    this.updateStats()
    this.updateViewport()
    this.updateStatus()
  }

  checkStatus = () => {
    const { rocket } = this.bodies
    if (
      Helper.dist(rocket.positionPrev, rocket.position) === 0 &&
      rocket.speed <= SPEED_EPSILON
    ) {
      this.land()
    }
  }

  // update fire position and rotation
  updateVisuals = () => {
    const { rocket, fire } = this.bodies
    const { x, y } = rocket
    const distFromCenter = Helper.map(
      this.status.force,
      0,
      MAX_ROCKET_FORCE,
      rocket.mass / (ROCKET_DIM * 1.5),
      rocket.mass / ((ROCKET_DIM * 18) / 30)
    )

    Body.setPosition(fire, {
      x:
        x -
        distFromCenter * Math.cos(rocket.angle - Math.PI / 2) +
        Math.cos(rocket.speed * 100),
      y:
        y -
        distFromCenter * Math.sin(rocket.angle - Math.PI / 2) +
        Math.sin(rocket.speed * 100)
    })
    Body.setAngle(fire, rocket.angle - Math.PI / 2)
  }

  updateStats = () => {
    if (this.status.focused) {
      const { rocket } = this.bodies

      this.textToRender = ```
thrust: ${this.status.force.toFixed(TO_FIXED)}
angle: ${Helper.toDegrees(Helper.normalizeAngle(rocket.angle))}
speed: ${rocket.speed}
fuel: ${this.status.fuel.toFixed(TO_FIXED)}
      ```
    }
  }

  // focus on rocket on click
  updateViewport = () => {
    const { body } = mouseConstraint
    if (body && body.label === 'rocket' && body === this.rigidBody) {
      Render.lookAt(
        this.game.render,
        { position: this.bodies.rocket.position },
        { x: FOCUS_PADDING, y: FOCUS_PADDING }
      )

      this.status.focused = true
      this.game.focusOnRocket(this)
    }
  }

  updateStatus = () => {
    this.status.lastSpeed = this.bodies.rocket.speed
    this.status.lifetime = performance.now() - this.status.bornTime
  }

  /* -------------------------------------------------------------------------- */
  /*                                   ACTIONS                                  */
  /* -------------------------------------------------------------------------- */
  interact = (part, obstacle) => {
    const angleDiff = Helper.toDegrees(
      Helpers.normalizeAngle(Math.abs(part.angle - obstacle.angle))
    )

    if (
      !Helper.isRocketFoot(part) ||
      angleDiff > LANDING_ANGLE_TOLERANCE ||
      this.status.lastSpeed > SPEED_TOLERANCE
    ) {
      this.crash()
    }
  }

  thrust = () => {}

  rotateLeft = () => {
    const { rocket } = this.bodies

    const amount =
      rocket.angle + ANGULAR_SPEED <= MAX_ROTATION
        ? ANGULAR_SPEED
        : Math.max(MAX_ROTATION - rocket.angle, 0)
    Body.rotate(rocket, amount)
  }

  rotateRight = () => {
    const { rocket } = this.bodies

    const amount =
      rocket.angle - ANGULAR_SPEED >= -MAX_ROTATION
        ? -ANGULAR_SPEED
        : Math.max(-MAX_ROTATION + rocket.angle, 0)
    Body.rotate(rocket, amount)
  }

  land = () => {
    this.state = LANDED_STATE

    const { rocket, fire } = this.bodies
    Body.setStatic(rocket, true)
    Body.setStatic(fire, true)
  }

  crash = () => {
    const { world } = this.game.engine
    const { rocket, fire } = this.bodies
    this.state = CRASHED_STATE

    const bodyParts = []
    rocket.parts.forEach((p, i) => {
      if (i === 0) return

      p.parent = p
      p.label = ABANDONED_LABEL

      Body.setStatic(p, true)

      bodyParts.push(p)
    })

    Body.setParts(rocket, [rocket])
    World.remove(world, rocket, true)
    World.remove(world, fire, true)

    World.add(world, bodyParts)
    bodyParts.forEach((bp) => Body.setStatic(bp, false))
  }

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

  /* -------------------------------------------------------------------------- */
  /*                                   OTHERS                                   */
  /* -------------------------------------------------------------------------- */
  draw = () => {
    const { rocket } = this.bodies

    if (this.status.focused) {
      const { x, y } = mapRelativeToFocused(rocket.position, this.game.render)

      const xOffset = ROCKET_DIM * 2
      const yOFfset = ROCKET_DIM / 2

      Helper.renderText(
        this.textToRender,
        {
          x: x + xOffset,
          y: y + yOFfset
        },
        20
      )
    }
  }

  removeFocus = () => {
    this.status.focused = false
  }
}
