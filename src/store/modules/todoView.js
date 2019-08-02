import flatten from 'lodash/flatten'
import { getWeekDayNameFromDate, isInDateRange } from '@/lib/utils'

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
        let name = f.name
        if (f.project && (f.project in rootState.user.projects)) {
          const projectName = rootState.user.projects[f.project].name
          name = `${projectName}/${name}`
        }
        const id = f.id
        // const isShared = rootState.user.id === f.own_user
        const undoNumber = f.undos.length
        return { id, name, undoNumber }
      })
    },
    starFolderTodos (state, getters, rootState) {
      console.log('star')
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
    todayFolderTodos (state, getters, rootState) {
      const folderList = rootState.user.folderList
      return folderList.map(folder => {
        const name = rootState.user.folders[folder].name
        const todos = rootState.user.folders[folder].undos
          .map(t => rootState.user.todos[t])
          .filter(todo => {
            const today = new Date()
            const expiredDate = new Date(todo.expired_date)
            return today.getDate() === expiredDate.getDate() &&
              today.getMonth() === expiredDate.getMonth() &&
              today.getFullYear() === expiredDate.getFullYear()
          })
        return { name, todos }
      }).filter(({ todos }) => todos.length)
    },
    thisWeekFolderTodos (state, getters, rootState) {
      console.log('this week')
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const stopDate = new Date()
      stopDate.setDate(stopDate.getDate() + 7)
      const weekTodos = []
      const weekMap = {}
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)
        weekMap[date.getDate()] = i
        const dayTodos = { name: getWeekDayNameFromDate(date), todos: [] }
        if (i === 0) {
          dayTodos.name = '今天'
        } else if (i === 1) {
          dayTodos.name = '明天'
        }
        weekTodos.push(dayTodos)
      }
      const folderList = rootState.user.folderList
      flatten(folderList.map(folder => {
        return rootState.user.folders[folder].undos.map(t => rootState.user.todos[t]).filter(todo => {
          return (!!todo.expired_date) && isInDateRange(today, stopDate, new Date(todo.expired_date))
        })
      })).map(todo => {
        let date = parseInt(todo.expired_date.substring(todo.expired_date.length - 2))
        const index = weekMap[date]
        weekTodos[index].todos.push(todo)
      })
      return weekTodos.filter(({ todos }) => todos.length > 0)
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
          return getters.todayFolderTodos
        case 'thisWeek':
          return getters.thisWeekFolderTodos
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
