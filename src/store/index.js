import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import todoView from './modules/todoView'
import projectView from './modules/projectView'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    user,
    todoView,
    projectView
  }
})
