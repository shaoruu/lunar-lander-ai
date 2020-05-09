/* -------------------------------------------------------------------------- */
/*                                   CANVAS                                   */
/* -------------------------------------------------------------------------- */
const CANVAS_WIDTH = wrapperDOM.clientWidth
const CANVAS_HEIGHT = wrapperDOM.clientHeight

/* -------------------------------------------------------------------------- */
/*                                 ENVIRONMENT                                */
/* -------------------------------------------------------------------------- */
const BORDERS_LABEL = 'borders'
const GRAVITY = 0.1
const BORDER_THICKNESS = 20
const BORDER_COLOR = '#111'
const HILLS_LABEL = 'hills'
const HILLS_THICKNESS = 5
const HILLS_COLOR = '#333942'
const HILLS_AMPLITUDE_FACTOR = 0.5
const HILLS_INTERVAL = 100
const HILLS_OFFSET_FACTOR = 0.3
const STAR_RADIUS = 2
const STAR_OFFSET_FACTOR = 0.5
const STARS_SPEED = 0.15

/* -------------------------------------------------------------------------- */
/*                                   ROCKET                                   */
/* -------------------------------------------------------------------------- */
const ROCKET_LABEL = 'rocket'
const ROCKET_FOOT_LABEL = 'rocket-foot'
const ROCKET_OTHER_LABEL = 'rocket-other'
const ABANDONED_LABEL = 'abandoned'
const ROCKET_DIM = 30
const MAX_ROCKET_FORCE = 10
const MAX_ROCKET_FUEL = 500
const ROCKET_FUEL_DECR = 0.3
const ROCKET_FORCE_INC = 0.3
const THRUST_MASS_FACTOR = 1 / 6000
const REGULAR_STATE = 0
const CRASHED_STATE = 1
const LANDED_STATE = 2
const FOCUS_PADDING = 200
const TO_FIXED = 3
const MAX_ROTATION = Math.PI / 2
const SPEED_EPSILON = 0.03
const LANDING_ANGLE_TOLERANCE = 30 // degrees
const SPEED_TOLERANCE = 0.8
const ROCKET_MASS_RATIO = 0.2
const RAY_WIDTH = 0.8
const RAY_LENGTH = 500
const STATS_FONT_SIZE = 20
const ROCKET_SPAWN_X = 200
const ROCKET_SPAWN_Y = 100
const ANGULAR_SPEED = 1 / 30

/* -------------------------------------------------------------------------- */
/*                              GENETIC ALGORITHM                             */
/* -------------------------------------------------------------------------- */
const MAX_UNIT = 30
const TOP_UNIT = 5
const FUEL_WEIGHT = -0.1
const HILL_WIDTH_WEIGHT = -0.1
const HILL_SLOPE_WEIGHT = 0.6
const HILL_AMPLITUDE_WEIGHT = 0.07
const ROTATION_WEIGHT = -0.06
const TIME_WEIGHT = 0.03
const LANDING_SCORE = 100
const CRASH_SCORE = -50
const NETWORK_DX_WEIGHT = 0.3
const NETWORK_DY_WEIGHT = 0.5
const NETWORK_SLOPE_WEIGHT = 0.8
const NETWORK_WIDTH_WEIGHT = 0.8
