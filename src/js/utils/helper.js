class Helper {
  static adjustCoords({ x, y }) {
    return {
      x,
      y: CANVAS_HEIGHT - y
    }
  }

  static magnitude({ x, y }) {
    return Math.sqrt(x ** 2 + y ** 2)
  }
}
