import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/index/Index.vue'
import TodoDetail from '../views/index/TodoDetail'
import TodoList from '../views/todolist/TodoList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index,
      redirect: '/todo',
      children: [
        {
          name: 'todo',
          path: 'todo',
          components: {
            default: TodoList,
            todoDetail: TodoDetail
          }
        }
      ]
    }
  ]
})
