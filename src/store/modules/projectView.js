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
      const projectList = rootState.user.projectList
      return projectList.map(project => {
        const p = rootState.user.projects[project]
        const { id, name } = p
        return { id, name }
      })
    },
    currentProjectFolders (state, getters, rootState) {
      const currentProject = rootState.user.projects[state.currentProject]
      if (!currentProject) {
        return []
      }
      return currentProject.folders.map(folder => {
        const f = rootState.user.folders[folder]
        const { id, name } = f
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
