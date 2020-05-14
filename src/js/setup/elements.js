const wrapperDOM = document.getElementById('wrapper')
const generationDOM = document.getElementById('generation')
const fittestDOM = document.getElementById('fittest')
const landedDOM = document.getElementById('landed')
const successRateDOM = document.getElementById('success-rate')

/* -------------------------------------------------------------------------- */
/*                                   SETTERS                                  */
/* -------------------------------------------------------------------------- */
class DOMChanger {
  static setGeneration(gen) {
    generationDOM.innerHTML = `Generation: ${gen}`
  }

  static setFittestDOM(value) {
    fittestDOM.innerHTML = `Fittest: ${value.toFixed(TO_FIXED)}`
  }
}

/* -------------------------------------------------------------------------- */
/*                              BUTTON LISTENERS                              */
/* -------------------------------------------------------------------------- */
const restartButtonDOM = document.getElementById('btn-restart')
const targetButtonDOM = document.getElementById('btn-target')
const wireframesButtonDOM = document.getElementById('btn-wireframes')
const colliRaysButtonDOM = document.getElementById('btn-collision-rays')
const speedUpButtonDOM = document.getElementById('btn-speedup')
const slowDownButtonDOM = document.getElementById('btn-slowdown')
const pausePlayButtonDOM = document.getElementById('btn-pause')
const speedTextDOM = document.getElementById('speed-text')
