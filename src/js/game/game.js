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
        wireframes: true,
        background: 'transparent'
        // showCollisions: true
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
      interval: HILLS_INTERVAL,
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

          this.zoomOut()
          this.focusedRocket.removeFocus()
          this.focusedRocket = null

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

        bodyA.parent.gameObject.interact(bodyA, bodyB)
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
  }

  startGame = () => {
    Events.on(this.render, 'afterRender', () => {
      this.stars.draw()
      this.GA.draw()
    })

    Events.on(this.engine, 'afterUpdate', () => {
      this.GA.update()
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

  //! Fix this code
  focusOnRocket = (rocket) => {
    this.focusedRocket = rocket
  }

  getObstacles = () => {
    return [...this.hills.bodies, ...this.borders.bodies]
  }
}
