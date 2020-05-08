class Stars {
  constructor({ count, offset, render }) {
    this.count = count
    this.offset = offset
    this.render = render

    this.stars = []

    this.initStars()
  }

  initStars = () => {
    for (let i = 0; i < this.count; i++) {
      const x = Math.random() * CANVAS_WIDTH
      const y = Math.random() * (CANVAS_HEIGHT - this.offset)

      // position and color
      this.stars.push([{ x, y }, Math.random() / 2])
    }
  }

  drawStar = (star) => {
    const [pos, color] = star
    const { x, y } = Helper.mapRelativeToFocused(pos, this.render)

    const radiusRatio =
      CANVAS_WIDTH / (this.render.bounds.max.x - this.render.bounds.min.x)

    const context = this.render.context
    context.fillStyle = `rgba(238,238,238,${color})`
    context.beginPath()
    context.ellipse(
      x,
      y,
      STAR_RADIUS * radiusRatio,
      STAR_RADIUS * radiusRatio,
      0,
      0,
      Math.PI * 2
    )
    context.fill()
  }

  draw = () => {
    this.stars.forEach(([pos]) => {
      pos.x += STARS_SPEED
      if (pos.x > CANVAS_WIDTH + STAR_RADIUS / 2) {
        pos.x = -STAR_RADIUS / 2
      }
    })
    this.stars.forEach(this.drawStar)
  }
}
