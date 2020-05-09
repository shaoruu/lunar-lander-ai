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
