class Hills {
  constructor({ engine, amplitude, offset }) {
    this.engine = engine
    this.amplitude = amplitude
    this.offset = offset

    this.noise = new Perlin()

    this.initHeights()
    this.initBodies()
  }

  initHeights = () => {
    this.heights = []

    let inc = 0

    const genHeightAt = (x) =>
      (this.noise.getValue(x / HILLS_PERLIN_SCALE + 1) / 2) * this.amplitude +
      this.offset

    for (let i = 0; i <= CANVAS_WIDTH; i += inc) {
      const height =
        i !== 0 && this.heights.length % HILLS_FLAT_EVERY === 0
          ? this.heights[this.heights.length - 1].y
          : genHeightAt(i)

      this.heights.push({
        x: i,
        y: height
      })

      inc = Helper.randomBetween(HILLS_MIN_INTERVAL, HILLS_MAX_INTERVAL)
      if (i + inc > CANVAS_WIDTH) {
        const height = genHeightAt(CANVAS_WIDTH)
        this.heights.push({ x: CANVAS_WIDTH, y: height })
      }
    }
  }

  initBodies = () => {
    this.bodies = []

    for (let i = 0; i < this.heights.length - 1; i++) {
      const { x: cx, y: cy } = Helper.adjustCoords(this.heights[i])
      const { x: nx, y: ny } = Helper.adjustCoords(this.heights[i + 1])

      const dx = nx - cx
      const dy = ny - cy

      const width = Helper.magnitude({ x: dx, y: dy })
      const angle = Math.atan2(dy, dx)
      const slope = dy / dx

      const isTarget = Math.abs(slope) < HILLS_TARGET_SLOPE

      const newBody = Bodies.rectangle(
        (cx + nx) / 2,
        (cy + ny) / 2,
        width,
        HILLS_THICKNESS,
        {
          label: HILLS_LABEL,
          angle,
          isStatic: true,
          friction: 3,
          frictionStatic: 10,
          render: {
            // fillStyle: HILLS_COLOR
            fillStyle: isTarget ? HILLS_TARGET_COLOR : HILLS_COLOR,
            strokeStyle: isTarget ? HILLS_TARGET_COLOR : HILLS_COLOR,
            opacity: 1 / slope
          }
        }
      )

      newBody.isTarget = isTarget

      this.bodies.push(newBody)
    }

    World.add(this.engine.world, this.bodies)
  }

  getClosest = (body) => {
    let closest = null
    let min = Number.MAX_SAFE_INTEGER

    for (let i = 0; i < this.bodies.length; i++) {
      const hill = this.bodies[i]
      if (!hill.isTarget) continue

      const dist = Helper.dist(hill.position, body.position)
      if (min > dist) {
        min = dist
        closest = hill
      } else if (!!closest && dist > min) {
        break
      }
    }

    return closest
  }
}
