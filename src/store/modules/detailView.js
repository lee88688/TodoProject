export const types = {
  CHANGE_DETAIL_VIEW_VISIBLE: 'CHANGE_DETAIL_VIEW_VISIBLE',
  CHANGE_CURRENT_TODO: 'CHANGE_CURRENT_TODO'
}

export default {
  namespaced: true,
  state: {
    showDetailView: false,
    currentTodo: '',
    currentCompleteTodo: '' // cache complete todos, which is an object nor an id.
  },
  mutations: {
    [types.CHANGE_DETAIL_VIEW_VISIBLE]: function (state, visible) {
      state.showDetailView = !!visible
    },
    [types.CHANGE_CURRENT_TODO]: function (state, id) {
      if (typeof id !== 'string') {
        return
      }
      state.currentTodo = id
    }
  },
  actions: {
    changeDetailViewVisible ({ commit }, visible) {
      commit(types.CHANGE_DETAIL_VIEW_VISIBLE, visible)
    },
    changeCurrentTodo ({ commit }, id) {
      commit(types.CHANGE_CURRENT_TODO, id)
    }
  }
}
