export const types = {
  CHANGE_CURRENT_FOLDER: 'CHANGE_CURRENT_FOLDER'
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
    currentTodo: ''
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
    }
  },
  actions: {
    changeFolder ({ commit }, folder) {
      commit(types.CHANGE_CURRENT_FOLDER, folder)
    }
  }
}
