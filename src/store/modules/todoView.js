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
    currentFolder: ''
  },
  getters: {
    currentFolderName (state, getters, rootState, rootGetters) {
      if (rootGetters['globalAction/searchValid']) {
        return '搜索'
      }
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
        const todos = rootState.user.folders[folder].undos.map(t => rootState.user.todos[t]).filter(todo => todo.star)
        return { name, todos }
      }).filter(({ todos }) => todos.length)
    },
    searchFolderTodos (state, getters, rootState) {
      const searchKeyword = rootState.globalAction.palette.input
      const folderList = rootState.user.folderList
      return folderList.map(folder => {
        const name = rootState.user.folders[folder].name
        const todos = rootState.user.folders[folder].undos
          .map(t => rootState.user.todos[t])
          .filter(todo => todo.name.includes(searchKeyword))
        return { name, todos }
      }).filter(({ todos }) => todos.length)
    },
    todos (state, getters, rootState, rootGetters) {
      // search mode first
      if (rootGetters['globalAction/searchValid'] && rootState.user.isTodoView) {
        return getters.searchFolderTodos
      }
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
      state.currentFolder = folder
    }
  },
  actions: {
    changeFolder ({ commit }, folder) {
      if (typeof folder !== 'string') {
        return
      }
      commit(types.CHANGE_CURRENT_FOLDER, folder)
    }
  }
}
