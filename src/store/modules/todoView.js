export const types = {
  CHANGE_CURRENT_FOLDER: 'CHANGE_CURRENT_FOLDER',
  CHANGE_CURRENT_TODO: 'CHANGE_CURRENT_TODO',
  SWITCH_MINI_FOLDER_LIST: 'SWITCH_MINI_FOLDER_LIST',
  CHANGE_DETAIL_VIEW_VISIBLE: 'CHANGE_DETAIL_VIEW_VISIBLE'
}

export default {
  namespaced: true,
  state: {
    specialList: {
      start: false,
      today: false,
      thisWeek: false
    },
    currentFolder: '',
    currentTodo: '',
    showDetailView: true,
    showMiniFolderListView: false
  },
  getters: {
    currentFolderName (state, getters, rootState) {
      switch (state.currentFolder) {
        case 'star':
          return '标星'
        case 'today':
          return '今日'
        case 'thisWeek':
          return '本周'
      }
      const folder = rootState.user.folders[state.currentFolder]
      if (!folder) {
        return ''
      } else {
        return folder.name
      }
    },
    folders (state, getters, rootState) {
      const folderList = rootState.user.folderList
      return folderList.map(folder => {
        const f = rootState.user.folders[folder]
        const name = f.name
        const id = f.id
        // const isShared = rootState.user.id === f.own_user
        const undoNumber = f.undos.length
        return { id, name, undoNumber }
      })
    },
    starFolderTodos (state, getters, rootState) {
      const folderList = rootState.user.folderList
      return folderList.map(folder => {
        const name = rootState.user.folders[folder].name
        const todos = rootState.user.folders[folder].undos
        return { name, todos }
      }).filter(({ todos }) => todos.length)
    },
    todos (state, getters, rootState) {
      switch (state.currentFolder) {
        case 'star':
          return getters.starFolderTodos
        case 'today':
          return []
        case 'thisWeek':
          return []
        default:
          if (state.currentFolder in rootState.user.folders) {
            // other folder
            break
          }
          return []
      }
      // get folder todos
      const folder = rootState.user.folders[state.currentFolder]
      return [{
        name: '',
        todos: folder.undos.map(id => rootState.user.todos[id])
      }]
    }
  },
  mutations: {
    [types.CHANGE_CURRENT_FOLDER]: function (state, folder) {
      if (typeof folder !== 'string') {
        return
      }
      state.currentFolder = folder
    },
    [types.CHANGE_CURRENT_TODO]: function (state, id) {
      if (typeof id !== 'string') {
        return
      }
      state.currentTodo = id
    },
    [types.SWITCH_MINI_FOLDER_LIST]: function (state) {
      state.showMiniFolderListView = !state.showMiniFolderListView
    },
    [types.CHANGE_DETAIL_VIEW_VISIBLE]: function (state, visible) {
      state.showDetailView = !!visible
    }
  },
  actions: {
    changeFolder ({ commit }, folder) {
      commit(types.CHANGE_CURRENT_FOLDER, folder)
    },
    changeCurrentTodo ({ commit }, id) {
      commit(types.CHANGE_CURRENT_TODO, id)
    },
    switchMiniFolderListView ({ commit }) {
      commit(types.SWITCH_MINI_FOLDER_LIST)
    },
    changeDetailViewVisible ({ commit }, visible) {
      commit(types.CHANGE_DETAIL_VIEW_VISIBLE, visible)
    }
  }
}
