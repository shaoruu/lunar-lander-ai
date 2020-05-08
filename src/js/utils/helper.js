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

  static argMax(array) {
    return [].map
      .call(array, (x, i) => [x, i])
      .reduce((r, a) => (a[0] > r[0] ? a : r))[1]
  }

  static roundTo(v, d) {
    return Math.round(v * 10 ** d) / 10 ** d
  }

  static clamp(a, b, c) {
    return Math.max(b, Math.min(c, a))
  }

  static map(v, min1, max1, min2, max2) {
    return ((max2 - min2) * (v - min1)) / (max1 - min1) + min2
  }

  static isRocket(body) {
    return body.label.includes(ROCKET_LABEL)
  }

  static isRocketFoot(body) {
    return body
  }

  static toDegrees(r) {
    return (r / Math.PI) * 180
  }

  static normalizeAngle(radians) {
    return radians - Math.PI * 2 * Math.floor(radians / Math.PI / 2)
  }
}
