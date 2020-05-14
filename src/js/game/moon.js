class Moon {
  constructor({ x, y, render }) {
    this.x = x
    this.y = y

    this.render = render

    this.image = new Image()
    this.image.src = 'assets/moon.svg'

    this.image.onload = () => {
      this.imageLoaded = true
    }
  }

  draw() {
    if (!this.imageLoaded) return

    const ctx = this.render.context
    // ctx.save()
    ctx.globalCompositeOperation = 'destination-over'
    ctx.drawImage(this.image, this.x, this.y, 500, 500)
    ctx.globalCompositeOperation = 'source-over'
    // ctx.restore()
  }
}
