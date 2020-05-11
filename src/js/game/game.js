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

    this.runner = Runner.create({ speedFactor: 1 })

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

    this.options = {
      showTarget: false,
      showColliRays: false
    }

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
      count: STARS_COUNT,
      offset: CANVAS_HEIGHT * STARS_OFFSET_FACTOR
    })

    this.paused = false
    this.lastTime = performance.now()

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

    // controls
    restartButtonDOM.addEventListener('click', () => {
      this.restart()
    })

    wireframesButtonDOM.addEventListener('click', () => {
      wireframesButtonDOM.innerHTML = this.toggleRenderOption('wireframes')
    })

    targetButtonDOM.addEventListener('click', () => {
      targetButtonDOM.innerHTML = this.toggleOption('showTarget', 'target')
    })

    colliRaysButtonDOM.addEventListener('click', () => {
      colliRaysButtonDOM.innerHTML = this.toggleOption(
        'showColliRays',
        'Collision Rays'
      )
    })

    this.speedProxy = Helper.listen(this.runner, 'speedFactor', (value) => {
      if (value > 1) pausePlayButtonDOM.disabled = true
      else pausePlayButtonDOM.disabled = false
      speedTextDOM.innerHTML = `${value}X`
    })

    slowDownButtonDOM.addEventListener('click', this.slowDown)

    speedUpButtonDOM.addEventListener('click', this.speedUp)

    pausePlayButtonDOM.addEventListener('click', () => {
      if (this.paused) {
        this.resume()
        pausePlayButtonDOM.innerHTML = 'II'
      } else {
        this.pause()
        pausePlayButtonDOM.innerHTML = '>'
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
      this.stars.draw(this.paused)
      this.GA.draw()
      // this.rocket.draw()
    })

    Events.on(this.runner, 'afterUpdate', () => {
      if (this.paused) return
      this.GA.update(performance.now() - this.lastTime)
      this.lastTime = performance.now()
      // this.rocket.update()
    })

    // Engine.run(this.engine)
    Runner.run(this.runner, this.engine)
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

  pause = () => {
    this.paused = true

    while (this.runner.speedFactor > 0) {
      Runner.stop(this.runner, this.engine)
      this.speedProxy.speedFactor--
    }
  }

  resume = () => {
    this.pause()

    Runner.start(this.runner, this.engine)
    this.speedProxy.speedFactor = 1

    this.paused = false
  }

  speedUp = () => {
    if (this.paused) return
    // hack to speed engine up
    Runner.start(this.runner, this.engine)
    this.speedProxy.speedFactor++
  }

  slowDown = () => {
    if (this.paused || this.runner.speedFactor <= 1) return
    Runner.stop(this.runner)
    this.speedProxy.speedFactor--
  }

  restart = () => {
    this.GA.restart()
  }

  toggleOption = (option, text) => {
    const newBool = !this.options[option]
    this.options[option] = newBool
    return `${text.toUpperCase()}: ${newBool ? 'ON' : 'OFF'}`
  }

  toggleRenderOption = (option) => {
    const newBool = !this.render.options[option]
    this.render.options[option] = newBool
    return `${option.toUpperCase()}: ${newBool ? 'ON' : 'OFF'}`
  }

  get hasFocus() {
    return !!this.focusedRocket
  }
}
