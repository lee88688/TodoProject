import { getArchiveTodo } from '@/lib/indexedDB'

export const types = {
  CHANGE_DETAIL_VIEW_VISIBLE: 'CHANGE_DETAIL_VIEW_VISIBLE',
  CHANGE_CURRENT_TODO: 'CHANGE_CURRENT_TODO',
  CHANGE_CURRENT_COMPLETE_TODO: 'CHANGE_CURRENT_COMPLETE_TODO',
  CHANGE_CURRENT_COMPLETE_TODO_TYPE: 'CHANGE_CURRENT_COMPLETE_TODO_TYPE'
}

export const currentTodoTypes = {
  NORMAL: 'NORMAL',
  COMPLETE: 'COMPLETE'
}

export default {
  namespaced: true,
  state: {
    showDetailView: false,
    currentTodo: '',
    currentTodoType: currentTodoTypes.NORMAL,
    currentCompleteTodo: '' // cache complete todos, which is an object nor an id.
  },
  getters: {
    isCompleteTodo (state) {
      return state.currentTodoType === currentTodoTypes.COMPLETE
    }
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
    },
    [types.CHANGE_CURRENT_COMPLETE_TODO]: function (state, completeTodo) {
      state.currentCompleteTodo = completeTodo
    },
    [types.CHANGE_CURRENT_COMPLETE_TODO_TYPE]: function (state, type) {
      state.currentTodoType = type
    }
  },
  actions: {
    changeDetailViewVisible ({ commit }, visible) {
      commit(types.CHANGE_DETAIL_VIEW_VISIBLE, visible)
    },
    changeCurrentTodo ({ commit, state }, id) {
      if (state.currentTodoType === currentTodoTypes.COMPLETE) {
        commit(types.CHANGE_CURRENT_COMPLETE_TODO_TYPE, currentTodoTypes.NORMAL)
      }
      commit(types.CHANGE_CURRENT_TODO, id)
    },
    async changeCurrentCompleteTodo ({ commit, state }, id) {
      if (state.currentTodoType === currentTodoTypes.NORMAL) {
        commit(types.CHANGE_CURRENT_COMPLETE_TODO_TYPE, currentTodoTypes.COMPLETE)
      }
      let todo = await getArchiveTodo(id)
      commit(types.CHANGE_CURRENT_COMPLETE_TODO, todo)
    }
  }
}
