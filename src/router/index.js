import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/index/Index.vue'
import TodoDetail from '../views/index/TodoDetail'
import Todo from '../views/todo/Index'
import Project from '../views/project/Index'

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
            default: Todo,
            todoDetail: TodoDetail
          }
        },
        {
          name: 'project',
          path: 'project',
          components: {
            default: Project,
            todoDetail: TodoDetail
          }
        }
      ]
    }
  ]
})
