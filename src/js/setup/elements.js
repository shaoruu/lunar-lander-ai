const wrapperDOM = document.getElementById('wrapper')
const generationDOM = document.getElementById('generation')

/* -------------------------------------------------------------------------- */
/*                                   SETTERS                                  */
/* -------------------------------------------------------------------------- */
class DOMChanger {
  static setGeneration(gen) {
    generationDOM.innerHTML = `Generation: ${gen}`
  }
}
