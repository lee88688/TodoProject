import uuidv1 from 'uuid/v1'
import cloneDeep from 'lodash/cloneDeep'
import clone from 'lodash/clone'
import isArray from 'lodash/isArray'
import Vue from 'vue'
import { keyMissingWarning, removeArrayElement, removeUndefinedKey } from '@/lib/utils'
import { archiveTodo, deleteArchiveTodo, getArchiveTodo } from '@/lib/indexedDB'

export const types = {
  ADD_FOLDER: 'ADD_FOLDER',
  MODIFY_FOLDER: 'MODIFY_FOLDER',
  DELETE_FOLDER: 'DELETE_FOLDER',
  ADD_TODO: 'ADD_TODO',
  MODIFY_TODO: 'MODIFY_TODO',
  DELETE_TODO: 'DELETE_TODO',
  SWITCH_MINI_FOLDER_LIST: 'SWITCH_MINI_FOLDER_LIST',
  SWITCH_TODO_VIEW: 'SWITCH_TODO_VIEW',
  ADD_PROJECT: 'ADD_PROJECT',
  MODIFY_PROJECT: 'MODIFY_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  MODIFY_FOLDER_LIST: 'MODIFY_FOLDER_LIST',
  MODIFY_PROJECT_LIST: 'MODIFY_PROJECT_LIST'
}

export const prefixTypes = {}
for (const k in types) {
  prefixTypes[k] = `user/${types[k]}`
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
    showMiniFolderListView: false,
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
    },
    projectInfo (state) {
      return project => {
        let p = state.projects[project]
        if (!p) { throw new Error('project id not found') }
        const { id, name } = p
        return {
          id,
          name
        }
      }
    },
    folderInfo (state) {
      return folder => {
        let f = state.folders[folder]
        if (!f) { throw new Error('folder id not found') }
        const { id, name, project } = f
        return { id, name, project }
      }
    }
  },
  mutations: {
    [types.ADD_FOLDER]: function (state, payload) {
      if (!('id' in payload)) {
        keyMissingWarning(types.ADD_FOLDER, 'id')
        return
      }
      // state.folderList.push(payload.id)
      state.folders = { ...state.folders, [payload.id]: payload }
    },
    [types.MODIFY_FOLDER]: function (state, payload) {
      let folder = state.folders[payload.id]
      if (!folder) {
        return
      }
      folder = { ...folder, ...payload }
      removeUndefinedKey(folder)
      state.folders = { ...state.folders, [folder.id]: folder }
    },
    [types.DELETE_FOLDER]: function (state, folder) {
      if (!(folder in state.folders)) {
        return
      }
      Vue.delete(state.folders, folder)
    },
    [types.ADD_TODO]: function (state, payload) {
      if (!('id' in payload && 'folder' in payload)) {
        keyMissingWarning(types.ADD_TODO, 'id, folder')
        return
      }
      state.todos = { ...state.todos, [payload.id]: payload }
    },
    [types.MODIFY_TODO]: function (state, payload) {
      let todo = state.todos[payload.id]
      if (!todo) {
        return
      }
      todo = { ...todo, ...payload }
      removeUndefinedKey(todo)
      state.todos = { ...state.todos, [todo.id]: todo }
    },
    [types.DELETE_TODO]: function (state, todo) {
      if (!(todo in state.todos)) {
        return
      }
      // console.log('delete todo')
      Vue.delete(state.todos, todo)
    },
    [types.SWITCH_MINI_FOLDER_LIST]: function (state) {
      state.showMiniFolderListView = !state.showMiniFolderListView
    },
    [types.SWITCH_TODO_VIEW]: function (state, isTodoView) {
      state.isTodoView = !!isTodoView
    },
    [types.ADD_PROJECT]: function (state, payload) {
      if (!('id' in payload)) {
        keyMissingWarning(types.ADD_PROJECT, 'id')
        return
      }
      state.projects = { ...state.projects, [payload.id]: payload }
    },
    [types.MODIFY_PROJECT]: function (state, payload) {
      let project = state.projects[payload.id]
      if (!project) {
        return
      }
      project = { ...project, ...payload }
      removeUndefinedKey(project)
      state.projects = { ...state.projects, [project.id]: project }
    },
    [types.DELETE_PROJECT]: function (state, project) {
      if (!(project in state.projects)) { return }
      const index = state.projectList.findIndex(i => i === project)
      index >= 0 && state.projectList.splice(index, 1)
      const { folders } = state.projects[project]
      // unbind project and its folder
      folders.forEach(e => {
        (e in state.folders) && Vue.delete(state.folders[e], 'project')
      })
      Vue.delete(state.projects, project)
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
    // todos
    addTodo ({ commit, dispatch }, payload) {
      if (!('id' in payload)) {
        payload.id = uuidv1()
      }
      // add todo_to todos
      commit(types.ADD_TODO, payload)
      // append todo_to folder
      dispatch('appendTodoToFolder', { todo: payload.id, folder: payload.folder })
    },
    modifyTodo ({ commit, state, dispatch }, payload) {
      if (!payload.id) {
        return
      }
      commit(types.MODIFY_TODO, cloneDeep(payload))
      payload = clone(payload)
      if ('folder' in payload) {
        // check if folder is the same as todos original folder
        const f = state.folders[payload.folder]
        if (f && !f.undos.find(i => i === payload.id)) {
          // remove todos original folder
          const originalFolder = state.todos[payload.id].folder
          originalFolder && dispatch('removeTodoFromFolder', { todo: payload.id, folder: f.id })
          // add todos to new folder
          dispatch('appendTodoToFolder', { todo: payload.id, folder: payload.folder })
        }
      }
    },
    deleteTodo ({ commit, dispatch, state }, todo) {
      if (!(todo in state.todos)) {
        return
      }
      // remove todos from folder
      dispatch('removeTodoFromFolder', { todo, folder: state.todos[todo].folder })
      // remove todos
      commit(types.DELETE_TODO, todo)
    },
    async markTodoAsDone ({ dispatch, state }, todo) {
      await dispatch('modifyTodo', { id: todo, complete: true })
      const todoBakup = cloneDeep(state.todos[todo])
      await dispatch('deleteTodo', todo)
      await archiveTodo(todoBakup)
    },
    async markTodoAsUndone ({ dispatch, state }, id) {
      const todo = await getArchiveTodo(id)
      await dispatch('addTodo', todo)
      await dispatch('modifyTodo', { id, complete: false })
      await deleteArchiveTodo(id)
    },
    // folders
    addFolder ({ commit, dispatch }, payload) {
      const id = uuidv1()
      payload.id = id
      payload.undos = []
      commit(types.ADD_FOLDER, payload)
      // add to folder list
      dispatch('appendFolderToFolderList', id)
      // add folder to project
      if ('project' in payload) {
        dispatch('appendFolderToProject', { folder: id, project: payload.project })
      }
    },
    modifyFolder ({ commit, state, dispatch }, payload) {
      if (!payload.id || !(payload.id in state.folders)) {
        return
      }
      commit(types.MODIFY_FOLDER, payload)
      if ('project' in payload) {
        // the project does not contain folder
        const p = state.projects[payload.project]
        if (p && !p.folders.find(i => i === payload.id)) {
          // remove folder's original project
          const originalProject = state.folders[payload.id].project
          originalProject && dispatch('removeFolderFromProject', { folder: payload.id, project: payload.project })
          // add folder to new project
          dispatch('appendFolderToProject', { folder: payload.id, project: payload.project })
        }
      }
    },
    deleteFolder ({ commit, dispatch, state }, folder) {
      if (!(folder in state.folders)) {
        return
      }
      // remove folder from folderList
      dispatch('removeFolderFromFolderList', folder)
      // remove folder from project
      const project = state.folders[folder].project
      project && dispatch('removeFolderFromProject', { project, folder })
      // remove folder
      const undos = state.folders[folder].undos
      commit(types.DELETE_FOLDER, folder)
      // remove todos
      undos.forEach(t => commit(types.DELETE_TODO, t))
    },
    appendTodoToFolder ({ commit, state, dispatch }, { todo, folder }) {
      if (!(folder in state.folders)) {
        return
      }
      const undos = [...state.folders[folder].undos, todo]
      dispatch('modifyFolder', { id: folder, undos })
    },
    removeTodoFromFolder ({ commit, state, dispatch }, { todo, folder }) {
      if (!(todo in state.todos) || !(folder in state.folders)) {
        return
      }
      const undos = clone(state.folders[folder].undos)
      removeArrayElement(undos, i => i === todo)
      dispatch('modifyFolder', { id: folder, undos })
    },
    // projects
    addProject ({ commit, dispatch }, payload) {
      payload.id = uuidv1()
      payload.folders = []
      commit(types.ADD_PROJECT, payload)
      dispatch('appendProjectToProjectList', payload.id)
    },
    modifyProject ({ commit }, payload) {
      if (!payload.id) {
        return
      }
      commit(types.MODIFY_PROJECT, payload)
    },
    deleteProject ({ commit, state, dispatch }, { project, deleteSubs }) {
      if (!(project in state.projects)) {
        return
      }
      let projectFolderList = []
      if (deleteSubs === true) {
        projectFolderList = state.projects[project].folders
      }
      // unbind project and its folders
      state.projects[project].folders.forEach(folder => {
        dispatch('modifyFolder', { id: folder, project: undefined })
      })
      // remove project from projectList
      dispatch('removeProjectFromProjectList', project)
      // remove project
      commit(types.DELETE_PROJECT, project)
      // delete folders
      projectFolderList.forEach(f => dispatch('deleteFolder', f))
    },
    appendFolderToProject ({ state, dispatch }, { folder, project }) {
      if (!(folder in state.folders) && !(project in state.projects)) {
        return
      }
      const p = state.projects[project]
      const folders = [...p.folders, folder]
      dispatch('modifyProject', { id: project, folders })
    },
    removeFolderFromProject ({ state, dispatch }, { folder, project }) {
      if (!(folder in state.folders) && !(project in state.projects)) {
        return
      }
      const folders = clone(state.projects[project].folders)
      removeArrayElement(folders, i => i === folder)
      dispatch('modifyProject', { id: project, folders })
    },
    // folder list
    modifyFolderList ({ commit }, payload) {
      commit(types.MODIFY_FOLDER_LIST, payload)
    },
    appendFolderToFolderList ({ dispatch, state }, folder) {
      const payload = [...state.folderList, folder]
      dispatch('modifyFolderList', payload)
    },
    removeFolderFromFolderList ({ state, dispatch }, folder) {
      const payload = [...state.folderList]
      removeArrayElement(payload, i => i === folder)
      dispatch('modifyFolderList', payload)
    },
    // project list
    modifyProjectList ({ commit }, payload) {
      commit(types.MODIFY_PROJECT_LIST, payload)
    },
    appendProjectToProjectList ({ dispatch, state }, project) {
      const payload = [...state.projectList, project]
      dispatch('modifyProjectList', payload)
    },
    removeProjectFromProjectList ({ dispatch, state }, project) {
      const payload = [...state.projectList]
      removeArrayElement(payload, i => i === project)
      dispatch('modifyProjectList', payload)
    },
    // other
    switchMiniFolderListView ({ commit }) {
      commit(types.SWITCH_MINI_FOLDER_LIST)
    },
    switchTodoView ({ commit }, isTodoView) {
      commit(types.SWITCH_TODO_VIEW, isTodoView)
    }
  }
}
