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

    World.add(this.game.engine.world, [this.bodies.fire, this.bodies.rocket])
  }

  initStatus = () => {
    this.status = {
      force: 0,
      fuel: MAX_ROCKET_FUEL,
      focused: false,
      lastSpeed: 0,
      bornTime: performance.now(),
      lifetime: 0,
      collisions: {
        left: {
          startPoint: null,
          endPoint: null,
          point: null
        },
        right: {
          startPoint: null,
          endPoint: null,
          point: null
        },
        bottom: {
          startPoint: null,
          endPoint: null,
          point: null
        }
      }
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

      this.textToRender = `
thrust: ${this.status.force.toFixed(TO_FIXED)}
angle: ${Helper.toDegrees(Helper.normalizeAngle(rocket.angle)).toFixed(
        TO_FIXED
      )}°
speed: ${rocket.speed.toFixed(TO_FIXED)}
fuel: ${this.status.fuel.toFixed(TO_FIXED)}
`
    }
  }

  // focus on rocket on click
  updateViewport = () => {
    const { body } = this.game.mouseConstraint
    if (body && body.label === 'rocket' && body === this.bodies.rocket) {
      this.status.focused = true
      this.game.focusOnRocket(this)
    }

    if (this.status.focused) {
      Render.lookAt(this.game.render, this.bodies.rocket, {
        x: FOCUS_PADDING,
        y: FOCUS_PADDING
      })
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
      Helper.normalizeAngle(Math.abs(part.angle - obstacle.angle))
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

    this.bodies.abandoned = bodyParts
  }

  /* -------------------------------------------------------------------------- */
  /*                                    DRAW                                    */
  /* -------------------------------------------------------------------------- */
  draw = () => {
    if (this.state !== REGULAR_STATE) return

    this.drawCollisionRays()
    this.drawStats()
  }

  drawCollisionRays = () => {
    if (this.points) {
      this.points.forEach((depth) => {
        Helper.drawPoint(
          this.game.render,
          Helper.mapRelativeToFocused(depth, this.game.render),
          3 * Helper.getZoomRatio(this.game.render),
          'yellow'
        )
      })
    }

    ;['bottom', 'left', 'right'].forEach((side) => {
      const { startPoint, endPoint, point } = this.status.collisions[side]
      if (startPoint) {
        Helper.drawLine(
          this.game.render,
          Helper.mapRelativeToFocused(startPoint, this.game.render),
          Helper.mapRelativeToFocused(endPoint, this.game.render),
          !!point ? '#fff' : '#666',
          RAY_WIDTH * Helper.getZoomRatio(this.game.render)
        )
      }
    })
  }

  drawStats = () => {
    // render stats next to the rocket if it's focused
    if (this.status.focused && this.textToRender) {
      const { rocket } = this.bodies
      const { x, y } = Helper.mapRelativeToFocused(
        rocket.position,
        this.game.render
      )

      const xOffset = ROCKET_DIM * 2
      const yOffset = -ROCKET_DIM * 1.4

      Helper.renderText(
        this.game.render,
        this.textToRender,
        {
          x: x + xOffset,
          y: y + yOffset
        },
        20
      )
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              GENETIC ALGORITHM                             */
  /* -------------------------------------------------------------------------- */
  registerBrain = (brain) => {
    this.brain = brain
  }

  calculateInputs = () => {
    const { rocket } = this.bodies
    const startPoint = rocket.position

    this.points = []

    // cast a ray in three directions to see if any hills intersect
    ;[
      [Math.PI / 2, 'bottom'],
      [0, 'right'],
      [Math.PI, 'left']
    ].forEach(([angle, side]) => {
      const endPoint = Helper.getEndPoint(
        startPoint,
        rocket.angle + angle,
        RAY_LENGTH
      )
      const ray = Helper.getVector(startPoint, endPoint)
      const { point } = Helper.raycast(
        this.game.hills.bodies,
        startPoint,
        ray,
        RAY_LENGTH
      )

      if (point) {
        this.points.push(point)
      }

      this.status.collisions[side].startPoint = startPoint
      this.status.collisions[side].endPoint = endPoint
      this.status.collisions[side].point = point
    })
  }

  useBrain = () => {
    const inputs = this.calculateInputs()
    // const outputs = this.brain.activate(inputs)
    // const decision = Helpers.argMax(outputs)

    // this.decisions[decision]()
  }

  /* -------------------------------------------------------------------------- */
  /*                                   OTHERS                                   */
  /* -------------------------------------------------------------------------- */
  removeFocus = () => {
    this.status.focused = false
  }

  reset = ({ x, y, filter }) => {
    const { world } = this.game.engine
    const { rocket, fire, abandoned } = this.bodies

    // remove body/bodies determining on state
    switch (this.state) {
      case REGULAR_STATE:
        World.remove(world, rocket)
        World.remove(world, fire)
        break
      case CRASHED_STATE:
        abandoned.forEach((rb) => World.remove(world, rb))
        break
    }

    // empty cache
    this.points.splice(0, this.points.length)

    // reset status
    this.state = REGULAR_STATE
    this.initBody(x, y, filter)
    this.initStatus()
  }
}
