import uuidv1 from 'uuid/v1'
import { keyMissingWarning } from '@/lib/utils'

export const types = {
  ADD_FOLDER: 'ADD_FOLDER',
  ADD_TODO: 'ADD_TODO'
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
    // data
    folders: {},
    projects: {},
    todos: {}
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
    }
  }
}
