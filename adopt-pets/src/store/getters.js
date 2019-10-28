export default {
  animalsCount: (state) => {
    return state.cats.length + state.dogs.length
  },
  getAllCats: (state, getters) => { // Pass more getters
    return state.pets.filter((pet) => {
      return pet.species === 'cat'
    })
  }
}
