import uuidv1 from 'uuid/v1'
import cloneDeep from 'lodash/cloneDeep'
import isArray from 'lodash/isArray'
import Vue from 'vue'
import { keyMissingWarning } from '@/lib/utils'

export const types = {
  ADD_FOLDER: 'ADD_FOLDER',
  MODIFY_FOLDER: 'MODIFY_FOLDER',
  DELETE_FOLDER: 'DELETE_FOLDER',
  ADD_TODO: 'ADD_TODO',
  MODIFY_TODO: 'MODIFY_TODO',
  DELETE_TODO: 'DELETE_TODO',
  CHANGE_DETAIL_VIEW_VISIBLE: 'CHANGE_DETAIL_VIEW_VISIBLE',
  SWITCH_MINI_FOLDER_LIST: 'SWITCH_MINI_FOLDER_LIST',
  CHANGE_CURRENT_TODO: 'CHANGE_CURRENT_TODO',
  SWITCH_TODO_VIEW: 'SWITCH_TODO_VIEW',
  ADD_PROJECT: 'ADD_PROJECT',
  MODIFY_PROJECT: 'MODIFY_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  ADD_FOLDER_FOR_PROJECT: 'ADD_FOLDER_FOR_PROJECT',
  MODIFY_FOLDER_LIST: 'MODIFY_FOLDER_LIST',
  MODIFY_PROJECT_LIST: 'MODIFY_PROJECT_LIST'
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
    [types.MODIFY_FOLDER]: function (state, payload) {
      let folder = state.folders[payload.id]
      if (!folder) {
        return
      }
      folder = { ...folder, ...payload }
      state.folders = { ...state.folders, [folder.id]: folder }
    },
    [types.DELETE_FOLDER]: function (state, folder) {
      if (!(folder in state.folders)) {
        return
      }
      const { project, undos } = state.folders[folder]
      // folderList
      const index = state.folderList.findIndex(e => e === folder)
      index >= 0 && state.folderList.splice(index, 1)
      // project
      if (project in state.projects) {
        const p = state.projects[project]
        const index = p.folders.findIndex(e => e === folder)
        index >= 0 && p.folders.splice(index, 1)
      }
      // todos
      undos.forEach(e => Vue.delete(state.todos, e))
      // folders
      Vue.delete(state.folders, folder)
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
    [types.DELETE_TODO]: function (state, todo) {
      if (!(todo in state.todos)) {
        return
      }
      const folder = state.todos[todo].folder
      const f = state.folders[folder]
      if (f) {
        const index = f.undos.findIndex(e => e === todo)
        index >= 0 && f.undos.splice(index, 1)
      }
      Vue.delete(state.todos, todo)
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
    },
    [types.ADD_PROJECT]: function (state, payload) {
      if (!('id' in payload)) {
        keyMissingWarning(types.ADD_PROJECT, 'id')
        return
      }
      state.projectList.push(payload.id)
      state.projects = { ...state.projects, [payload.id]: payload }
    },
    [types.MODIFY_PROJECT]: function (state, payload) {
      let project = state.projects[payload.id]
      if (!project) {
        return
      }
      project = { ...project, ...payload }
      state.projects = { ...state.projects, [project.id]: project }
    },
    [types.DELETE_PROJECT]: function (state, project) {
      if (!(project in state.projects)) { return }
      const { folders } = state.projects[project]
      // unbind project and its folder
      folders.forEach(e => {
        (e in state.folders) && Vue.delete(state.folders[e], 'project')
      })
      Vue.delete(state.projects, project)
    },
    [types.ADD_FOLDER_FOR_PROJECT]: function (state, payload) {
      const { folder, project } = payload
      if (!(folder in state.folders) && !(project in state.projects)) {
        return
      }
      const p = state.projects[project]
      p.folders.push(folder)
      state.projects = { ...state.projects, [p.id]: p }
    },
    [types.MODIFY_FOLDER_LIST]: function (state, payload) {
      if (!isArray(payload)) {
        return
      }
      state.folderList.splice(0, state.folderList.length, ...payload)
    },
    [types.MODIFY_PROJECT_LIST]: function (state, payload) {
      if (!isArray(payload)) {
        return
      }
      state.projectList.splice(0, state.projectList.length, ...payload)
    }
  },
  actions: {
    addFolder ({ commit }, payload) {
      const id = uuidv1()
      payload.id = id
      payload.undos = []
      commit(types.ADD_FOLDER, payload)
      if ('project' in payload) {
        commit(types.ADD_FOLDER_FOR_PROJECT, { folder: id, project: payload.project })
      }
    },
    modifyFolder ({ commit }, payload) {
      if (!payload.id) {
        return
      }
      commit(types.MODIFY_FOLDER, payload)
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
    },
    addProject ({ commit }, payload) {
      payload.id = uuidv1()
      payload.folders = []
      commit(types.ADD_PROJECT, payload)
    },
    modifyProject ({ commit }, payload) {
      if (!payload.id) {
        return
      }
      commit(types.MODIFY_PROJECT, payload)
    },
    modifyFolderList ({ commit }, payload) {
      commit(types.MODIFY_FOLDER_LIST, payload)
    },
    modifyProjectList ({ commit }, payload) {
      commit(types.MODIFY_PROJECT_LIST, payload)
    },
    deleteTodo ({ commit }, todo) {
      commit(types.DELETE_TODO, todo)
    },
    deleteFolder ({ commit }, folder) {
      commit(types.DELETE_FOLDER, folder)
    },
    deleteProject ({ commit, state }, { project, deleteSubs }) {
      let projectFolderList = []
      if (deleteSubs === true && (project in state.projects)) {
        projectFolderList = state.projects[project].folderList
      }
      commit(types.DELETE_PROJECT, project)
      projectFolderList.forEach(f => commit(types.DELETE_FOLDER, f))
    }
  }
}
