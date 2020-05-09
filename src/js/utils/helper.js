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

  static mapRelativeToFocused(pos, render) {
    const { min, max } = render.bounds

    return {
      x: (CANVAS_WIDTH * (pos.x - min.x)) / (max.x - min.x),
      y: (CANVAS_HEIGHT * (pos.y - min.y)) / (max.y - min.y)
    }
  }

  static renderText(render, text, position, fontSize = 17) {
    const { x, y } = position

    const lines = text.split('\n')
    const context = render.context
    context.font = `${fontSize}px Arial`
    context.fillStyle = 'rgba(255, 255, 255, 0.5)'

    lines.forEach((line, i) => {
      context.fillText(line, x, y + fontSize * i)
    })
  }

  static getEndPoint(start, angle, distance) {
    const { x, y } = start

    const newX = x + Math.cos(angle) * distance
    const newY = y + Math.sin(angle) * distance

    return { x: newX, y: newY }
  }

  static drawLine(render, startPoint, endPoint, color, lineWidth = 0.5) {
    const context = render.context

    context.beginPath()
    context.moveTo(startPoint.x, startPoint.y)
    context.lineTo(endPoint.x, endPoint.y)
    context.strokeStyle = color
    context.lineWidth = lineWidth
    context.stroke()
  }

  static drawPoint(render, point, radius, color, drawBehind = true) {
    const context = render.context
    const { x, y } = point

    if (drawBehind) {
      context.globalCompositeOperation = 'destination-over'
    }

    context.fillStyle = color
    context.beginPath()
    context.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2)
    context.fill()

    context.globalCompositeOperation = 'source-over'
  }

  static drawSquare(render, position, dimension, color = '#FFFF00AF') {
    const context = render.context
    const { x, y } = position

    context.beginPath()
    context.strokeStyle = color
    context.rect(x - dimension / 2, y - dimension / 2, dimension, dimension)
    context.stroke()
  }

  static dist(pos1, pos2) {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2)
  }

  static getVector(start, end) {
    return {
      x: end.x - start.x,
      y: end.y - start.y
    }
  }

  static raycast(bodies, start, r, dist) {
    const normRay = Matter.Vector.normalise(r)
    let ray = normRay

    for (var i = 0; i < dist; i++) {
      ray = Matter.Vector.mult(normRay, i)
      ray = Matter.Vector.add(start, ray)
      const bod = Matter.Query.point(bodies, ray)[0]
      if (bod) {
        return { point: ray, body: bod }
      }
    }
    return {}
  }

  static getZoomRatio(render) {
    return CANVAS_WIDTH / (render.bounds.max.x - render.bounds.min.x)
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  static getAngleDiff(bodyA, bodyB) {
    return Helper.toDegrees(
      Helper.normalizeAngle(Math.abs(bodyA.angle - bodyB.angle))
    )
  }

  static listen(obj, attrib, func) {
    return new Proxy(obj, {
      set: function (target, key, value) {
        if (key === attrib) func(value)
        target[key] = value
        return true
      }
    })
  }

  static getRandomRocketColor() {
    const index = Helper.randomInt(0, ROCKET_COLORS.length - 1)
    return ROCKET_COLORS[index]
  }
}
