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
        wireframes: false,
        background: 'transparent'
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
      count: 50,
      offset: CANVAS_HEIGHT * STAR_OFFSET_FACTOR
    })

    this.initEvents()
    this.startGame()
  }

  initEvents = () => {
    document.addEventListener('keydown', (e) => {
      const { keyCode } = e

      switch (keyCode) {
        case 27: {
          this.zoomOut()
          this.focusedRocket.removeFocus()
          this.focusedRocket = null
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

  startGame = () => {
    Events.on(this.render, 'afterRender', () => {
      this.stars.draw()
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
}
