class Hills {
  constructor({ engine, amplitude, interval, offset }) {
    this.engine = engine
    this.amplitude = amplitude
    this.interval = interval
    this.offset = offset

    this.noise = new Perlin()

    this.initHeights()
    this.initBodies()
  }

  initHeights = () => {
    this.heights = []

    let inc = 0

    const genHeightAt = (x) =>
      (this.noise.getValue(x / 255 + 1) / 2) * this.amplitude + this.offset

    for (let i = 0; i <= CANVAS_WIDTH; i += inc) {
      const height =
        i !== 0 && this.heights.length % 4 === 0
          ? this.heights[this.heights.length - 1].y
          : genHeightAt(i)

      this.heights.push({
        x: i,
        y: height
      })

      inc = Math.random() * this.interval
      if (i + inc > CANVAS_WIDTH) {
        const height = genHeightAt(CANVAS_WIDTH)
        this.heights.push({ x: CANVAS_WIDTH, y: height })
      }
    }
  }

  initBodies = () => {
    this.rigidBodies = []

    for (let i = 0; i < this.heights.length - 1; i++) {
      const { x: cx, y: cy } = Helper.adjustCoords(this.heights[i])
      const { x: nx, y: ny } = Helper.adjustCoords(this.heights[i + 1])

      const dx = nx - cx
      const dy = ny - cy

      const width = Helper.magnitude({ x: dx, y: dy })
      const angle = Math.atan2(dy, dx)

      const newBody = Bodies.rectangle(
        (cx + nx) / 2,
        (cy + ny) / 2,
        width,
        HILLS_THICKNESS,
        {
          label: 'hill',
          angle,
          isStatic: true,
          friction: 3,
          frictionStatic: 3,
          render: {
            fillStyle: HILLS_COLOR
          }
        }
      )

      this.rigidBodies.push(newBody)
    }

    World.add(this.engine.world, this.rigidBodies)
  }
}
