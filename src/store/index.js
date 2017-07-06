import Vuex from 'vuex'

const emptyUser = {
  name: '',
  location: '',
  type: -1
}

const state = {
  user: {
    name: '',
    location: '',
    type: -1
  },
  isLogin: false,
  cart: [],
  rstId: -1
}

const mutations = {
  login: (user, input) => {
    for (let i in input) {
      state.user[i] = input[i]
    }
    state.isLogin = true
  },
  logout: () => {
    for (let i in emptyUser) {
      state.user[i] = emptyUser[i]
    }
    state.isLogin = false
    state.rstId = -1
    while (state.cart.pop()) {}
  },
  addCart: (_, { id, price, name }) => {
    for (let i in state.cart) {
      if (state.cart[i].id !== undefined && state.cart[i].id === id) {
        state.cart[i].amount += 1
        return
      }
    }
    state.cart.push({
      id,
      price,
      name,
      amount: 1
    })
  },
  removeCart: (_, id) => {
    for (let i in state.cart) {
      if (state.cart[i].id !== undefined && state.cart[i].id === id) {
        state.cart[i].amount -= 1
        if (state.cart[i].amount <= 0) {
          state.cart.splice(i, 1)
        }
        return
      }
    }
  },
  clearCart: () => {
    while (state.cart.pop()) {}
  },
  setRst: (_, rstId) => {
    if (state.rstId !== rstId) {
      state.rstId = rstId
      while (state.cart.pop()) {}
    }
  }
}

const getters = {
  totalPrice: (state) => {
    let total = 0.0
    for (let i in state.cart) {
      total += state.cart[i].price * state.cart[i].amount
    }
    return total
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
