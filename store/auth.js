export const state = () => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  SET_ERROR(state, error) {
    state.error = error
  },
  
  CLEAR_ERROR(state) {
    state.error = null
  }
}

export const actions = {
  setUser({ commit }, user) {
    commit('SET_USER', user)
  },
  
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  },
  
  setError({ commit }, error) {
    commit('SET_ERROR', error)
  },
  
  clearError({ commit }) {
    commit('CLEAR_ERROR')
  },
  
  logout({ commit }) {
    commit('SET_USER', null)
    commit('CLEAR_ERROR')
  }
}

export const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  user: (state) => state.user,
  loading: (state) => state.loading,
  error: (state) => state.error
}