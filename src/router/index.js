import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/todolist/Index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})
