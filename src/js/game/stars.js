class Stars {
  constructor({ count, offset, render }) {
    this.count = count
    this.offset = offset
    this.render = render

    this.stars = []
  }

  initStars = () => {
    for (let i = 0; i < this.count; i++) {
      const x = Math.random() * CANVAS_WIDTH
      const y = Math.random() * CANVAS_HEIGHT

      // position and color
      this.stars.push([{ x, y }, Math.random() / 2])
    }
  }

  drawStar = (star) => {
    const [pos, color] = star
    const { x, y } = pos

    const context = this.render.context
    context.fillStyle = `rgba(238,238,238,${color})`
    context.beginPath()
    context.ellipse(x, y, STAR_RADIUS, STAR_RADIUS, 0, 0, Math.PI * 2)
    context.fill()
  }

  draw = () => {
    this.stars.forEach(this.drawStar)
  }
}
