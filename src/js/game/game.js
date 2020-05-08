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

    this.startGame()
  }

  startGame = () => {
    Engine.run(this.engine)
    Render.run(this.render)
  }
}
