/* ROCKET */
const getRocketBody = (x, y, w, h, filter, color) => {
  const Y_OFFSET = h * 0

  const commonOptions = {
    slop: 0.05,
    density: 1,
    restitution: 0,
    collisionFilter: {
      group: filter
    }
  }

  const BODY_SCALE = 0.3
  const body = Bodies.polygon(
    x,
    y - h * BODY_SCALE + Y_OFFSET,
    8,
    h * BODY_SCALE,
    {
      label: ROCKET_OTHER_LABEL,
      render: {
        fillStyle: '#B5D2E1',
        opacity: 0.7
      },
      // mass: 0.01,
      ...commonOptions
    }
  )

  const fireEngine = Bodies.rectangle(
    x,
    y + h * 0.1 + Y_OFFSET,
    w * 0.3,
    h * 0.2,
    {
      label: ROCKET_OTHER_LABEL,
      render: {
        fillStyle: '#DDCFB5'
      },
      ...commonOptions
    }
  )
  Body.setMass(fireEngine, 10)

  const STAND_SCALE = 0.6
  const stand = Bodies.rectangle(x, y + Y_OFFSET, w * STAND_SCALE, h * 0.15, {
    label: ROCKET_OTHER_LABEL,
    render: {
      fillStyle: color
    },
    ...commonOptions
  })

  // this is the angle from bottom to left/right
  const LEG_ANGLE = Math.PI / 3
  const LEG_OFFSET = w * 0.25
  const leg1 = Bodies.rectangle(
    x + LEG_OFFSET,
    y + h * 0.15 + Y_OFFSET,
    w * 0.1,
    h * 0.3,
    {
      label: ROCKET_OTHER_LABEL,
      render: {
        fillStyle: '#EAC580'
      },
      angle: -Math.PI / 2 + LEG_ANGLE,
      ...commonOptions
    }
  )
  const leg2 = Bodies.rectangle(
    x - LEG_OFFSET,
    y + h * 0.15 + Y_OFFSET,
    w * 0.1,
    h * 0.3,
    {
      label: ROCKET_OTHER_LABEL,
      render: {
        fillStyle: '#EAC580'
      },
      angle: -Math.PI / 2 - LEG_ANGLE,
      ...commonOptions
    }
  )

  const FOOT_SCALE = 0.25

  const foot1 = Bodies.rectangle(
    x + LEG_OFFSET + w * 0.05,
    y + h * 0.3 + Y_OFFSET,
    w * FOOT_SCALE,
    h * 0.1,
    {
      label: ROCKET_FOOT_LABEL,
      render: {
        fillStyle: '#D65747'
      },
      ...commonOptions
    }
  )
  const foot2 = Bodies.rectangle(
    x - LEG_OFFSET - w * 0.05,
    y + h * 0.3 + Y_OFFSET,
    w * FOOT_SCALE,
    h * 0.1,
    {
      label: ROCKET_FOOT_LABEL,
      render: {
        fillStyle: '#D65747'
      },
      ...commonOptions
    }
  )

  const FIRE_SCALE = 0.15
  const fire = Bodies.polygon(x, y + Y_OFFSET, 3, w * FIRE_SCALE, {
    label: ROCKET_OTHER_LABEL,
    render: {
      fillStyle: '#F47423'
    },
    collisionFilter: { group: filter },
    angle: -Math.PI / 2,
    isSensor: true
  })

  return {
    rocket: Body.create({
      label: ROCKET_LABEL,
      parts: [leg1, leg2, foot1, foot2, fireEngine, body, stand],
      sleepThreshold: 100,
      ...commonOptions,
      // mass: (w * h) / 10,
      mass: w * h * ROCKET_MASS_RATIO,
      collisionFilter: { group: filter }
    }),
    fire
  }
}
