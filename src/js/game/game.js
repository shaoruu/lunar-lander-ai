class Game {
  constructor() {
    this.engine = Engine.create()
    this.engine.world.gravity.y = GRAVITY

    this.render = Render.create({
      engine: this.engine,
      element: wrapperDOM,
      options: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        pixelRatio: 1,
        wireframes: SHOULD_WIREFRAMES,
        hasBounds: false,
        background: 'transparent',
        showSleeping: false,
        showDebug: false,
        showBroadphase: false,
        showBounds: false,
        showVelocity: false,
        showCollisions: false,
        showSeparations: false,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showShadows: false,
        showVertexNumbers: false,
        showConvexHulls: false,
        showInternalEdges: false,
        showMousePosition: false
      }
    })

    this.mouse = Mouse.create(this.render.canvas)
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    })

    // Keep the mouse in sync with rendering
    this.render.mouse = this.mouse

    this.borders = new Borders(this.engine)

    this.hills = new Hills({
      engine: this.engine,
      amplitude: CANVAS_HEIGHT * HILLS_AMPLITUDE_FACTOR,
      offset: CANVAS_HEIGHT * HILLS_OFFSET_FACTOR
    })

    this.stars = new Stars({
      render: this.render,
      count: 20,
      offset: CANVAS_HEIGHT * STAR_OFFSET_FACTOR
    })

    this.initEvents()
    this.initRockets()
    this.startGame()
  }

  initEvents = () => {
    document.addEventListener('keydown', (e) => {
      const { keyCode } = e

      switch (keyCode) {
        case 27: {
          if (!this.focusedRocket) break
          this.removeFocus()

          break
        }
      }
    })

    Events.on(this.engine, 'collisionStart', (e) => {
      const { pairs } = e

      for (let i = 0; i < pairs.length; i++) {
        let { bodyA, bodyB } = pairs[i]
        const isARocket = Helper.isRocket(bodyA)
        const isBRocket = Helper.isRocket(bodyB)

        if (!isARocket && !isBRocket) continue

        if (isBRocket) {
          const temp = bodyA
          bodyA = bodyB
          bodyB = temp
        }

        if (bodyA.parent.gameObject instanceof Rocket) {
          bodyA.parent.gameObject.interact(bodyA, bodyB)
        }
      }
    })
  }

  initRockets = () => {
    this.GA = new GeneticAlgorithm({
      game: this,
      maxUnits: MAX_UNIT,
      topUnits: TOP_UNIT
    })
    this.GA.initRockets()
    this.GA.createBrains()
    // this.rocket = new Rocket({
    //   game: this,
    //   x: 200,
    //   y: 100,
    //   filter: Body.nextGroup(true),
    //   rotation: Math.PI / 3,
    //   velocity: { x: 1, y: 0 }
    // })
    // setInterval(() => {
    //   this.rocket.reset()
    // }, 3000)
  }

  startGame = () => {
    Events.on(this.render, 'afterRender', () => {
      this.stars.draw()
      this.GA.draw()
      // this.rocket.draw()
    })

    Events.on(this.engine, 'afterUpdate', () => {
      this.GA.update()
      // this.rocket.update()
      // console.log(this.rocket.fitness)
    })

    Engine.run(this.engine)
    Render.run(this.render)
  }

  zoomOut = () => {
    Render.lookAt(this.render, {
      min: { x: 0, y: 0 },
      max: { x: CANVAS_WIDTH, y: CANVAS_HEIGHT }
    })
  }

  removeFocus = () => {
    if (!this.focusedRocket) return

    this.zoomOut()
    this.focusedRocket.removeFocus()
    this.focusedRocket = null
  }

  focusOnRocket = (rocket) => {
    if (this.focusedRocket) {
      this.removeFocus()
    }
    this.focusedRocket = rocket
  }

  getObstacles = () => {
    return [...this.hills.bodies, ...this.borders.bodies]
  }

  get hasFocus() {
    return !!this.focusedRocket
  }
}
