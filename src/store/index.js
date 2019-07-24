import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import todoView from './modules/todoView'
import projectView from './modules/projectView'
import globalAction from './modules/globalAction'
import { readIndexedDBPlugin, syncStore } from './plugins'

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
    projectView,
    globalAction
  },
  plugins: [readIndexedDBPlugin, syncStore]
})
