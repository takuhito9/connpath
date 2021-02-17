import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    selectingGoal: {},
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setSelectingGoal(state, goal) {
      state.selectingGoal = goal
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState({storage: window.sessionStorage})] // Persistence of vuex
})
