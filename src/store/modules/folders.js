export default {
  namespaced: true,
  state: {
    folders: {}
  },
  getters: {
    starFolder (state, getters, rootState) {
      const folderList = rootState.users.folders
      const starTodoFolder = []
      for (let folder in folderList) {
        const folderStar = { name: folder.name, todos: [] }
      }
    }
  },
  mutations: {

  },
  actions: {

  }
}
