const wrapperDOM = document.getElementById('wrapper')
const generationDOM = document.getElementById('generation')
const fittestDOM = document.getElementById('fittest')

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
