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
const STAR_RADIUS = 3
const STAR_OFFSET_FACTOR = 0.5
const STARS_SPEED = 0.1

/* -------------------------------------------------------------------------- */
/*                                   ROCKET                                   */
/* -------------------------------------------------------------------------- */
const ROCKET_LABEL = 'rocket'
const ROCKET_FOOT_LABEL = 'rocket-foot'
const ROCKET_OTHER_LABEL = 'rocket-other'
const REGULAR_STATE = 0
const CRASHED_STATE = 1
const LANDED_STATE = 2
