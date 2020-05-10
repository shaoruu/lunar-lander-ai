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
      this.stars.push([{ x, y }, Math.random()])
    }
  }

  drawStar = (star) => {
    const [pos, opacity] = star

    const color = `rgba(238,238,238,${opacity})`

    Helper.drawPoint(
      this.render,
      Helper.mapRelativeToFocused(pos, this.render),
      STAR_RADIUS * Helper.getZoomRatio(this.render),
      color
    )
  }

  draw = () => {
    this.stars.forEach((star) => {
      const [pos] = star

      pos.x += STARS_SPEED
      if (pos.x > CANVAS_WIDTH + STAR_RADIUS / 2) {
        pos.x = -STAR_RADIUS / 2
        pos.y = Math.random() * (CANVAS_HEIGHT - this.offset)
      }

      this.drawStar(star)
    })
  }
}
