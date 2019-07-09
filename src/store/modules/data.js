export const ADD_FOLDER = 'ADD_FOLDER'

export default {
  namespaced: true,
  state: {
    folders: {},
    projects: {},
    todos: {}
  },
  getters: {
  },
  mutations: {
    [ADD_FOLDER]: function (state, payload) {
      if ('_id' in payload) {
        state.folders[payload['_id']] = payload
      }
    }
  },
  actions: {

  }
}
