export const types = {
  CHANGE_CURRENT_PROJECT: 'CHANGE_CURRENT_PROJECT'
}

export default {
  namespaced: true,
  state: {
    currentProject: ''
  },
  getters: {
    projects (state, getters, rootState) {
      const folderList = rootState.user.folderList
      folderList.map(project => {
        const p = rootState.user.projects[project]
        const { id, name } = p
        return { id, name }
      })
    }
  },
  mutations: {
    [types.CHANGE_CURRENT_PROJECT]: function (state, project) {
      state.currentProject = project
    }
  },
  actions: {
    changeCurrentProject ({ commit }, project) {
      if (typeof project !== 'string') {
        return
      }
      commit(types.CHANGE_CURRENT_PROJECT, project)
    }
  }
}
