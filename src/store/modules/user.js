import uuidv1 from 'uuid/v1'
import cloneDeep from 'lodash/cloneDeep'
import { keyMissingWarning } from '@/lib/utils'

export const types = {
  ADD_FOLDER: 'ADD_FOLDER',
  ADD_TODO: 'ADD_TODO',
  MODIFY_TODO: 'MODIFY_TODO',
  CHANGE_DETAIL_VIEW_VISIBLE: 'CHANGE_DETAIL_VIEW_VISIBLE',
  SWITCH_MINI_FOLDER_LIST: 'SWITCH_MINI_FOLDER_LIST',
  CHANGE_CURRENT_TODO: 'CHANGE_CURRENT_TODO',
  SWITCH_TODO_VIEW: 'SWITCH_TODO_VIEW'
}

export default {
  namespaced: true,
  state: {
    id: '',
    name: '',
    projectList: [],
    folderList: [],
    lastModifiedTime: null,
    token: '',
    // view
    isTodoView: true,
    showDetailView: true,
    showMiniFolderListView: false,
    currentTodo: '',
    // data
    folders: {},
    projects: {},
    todos: {}
  },
  getters: {
    userInfo (state) {
      return {
        id: state.id,
        name: state.name
      }
    }
  },
  mutations: {
    [types.ADD_FOLDER]: function (state, payload) {
      if (!('id' in payload)) {
        keyMissingWarning(types.ADD_FOLDER, 'id')
        return
      }
      state.folderList.push(payload.id)
      state.folders = { ...state.folders, [payload.id]: payload }
    },
    [types.ADD_TODO]: function (state, payload) {
      if (!('id' in payload && 'folder' in payload)) {
        keyMissingWarning(types.ADD_TODO, 'id, folder')
        return
      }
      const folder = state.folders[payload.folder]
      folder.undos.push(payload.id)
      state.todos = { ...state.todos, [payload.id]: payload }
    },
    [types.MODIFY_TODO]: function (state, payload) {
      let todo = state.todos[payload.id]
      if (!todo) {
        return
      }
      // for (let k in payload) {
      //   if (k === 'id' || !payload.hasOwnProperty(k)) {
      //     continue
      //   }
      //   todo[k] = payload[k]
      // }
      todo = { ...todo, ...payload }
      state.todos = { ...state.todos, [todo.id]: todo }
    },
    [types.CHANGE_DETAIL_VIEW_VISIBLE]: function (state, visible) {
      state.showDetailView = !!visible
    },
    [types.SWITCH_MINI_FOLDER_LIST]: function (state) {
      state.showMiniFolderListView = !state.showMiniFolderListView
    },
    [types.CHANGE_CURRENT_TODO]: function (state, id) {
      if (typeof id !== 'string') {
        return
      }
      state.currentTodo = id
    },
    [types.SWITCH_TODO_VIEW]: function (state, isTodoView) {
      state.isTodoView = !!isTodoView
    }
  },
  actions: {
    addFolder ({ commit }, payload) {
      payload.id = uuidv1()
      payload.undos = []
      commit(types.ADD_FOLDER, payload)
    },
    addTodo ({ commit }, payload) {
      payload.id = uuidv1()
      commit(types.ADD_TODO, payload)
    },
    modifyTodo ({ commit }, payload) {
      if (!payload.id) {
        return
      }
      commit(types.MODIFY_TODO, cloneDeep(payload))
    },
    switchMiniFolderListView ({ commit }) {
      commit(types.SWITCH_MINI_FOLDER_LIST)
    },
    changeDetailViewVisible ({ commit }, visible) {
      commit(types.CHANGE_DETAIL_VIEW_VISIBLE, visible)
    },
    changeCurrentTodo ({ commit }, id) {
      commit(types.CHANGE_CURRENT_TODO, id)
    },
    switchTodoView ({ commit }, isTodoView) {
      commit(types.SWITCH_TODO_VIEW, isTodoView)
    }
  }
}
