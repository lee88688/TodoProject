import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Index from '../views/index/Index.vue'
import TodoDetail from '../views/index/TodoDetail'
import Todo from '../views/todo/Index'
import Project from '../views/project/Index'

Vue.use(Router)

const beforeEnterProjectOrTodo = (to, from, next) => {
  // console.log(to)
  if (to.name === 'todo') {
    store.dispatch('user/switchTodoView', true)
  } else {
    store.dispatch('user/switchTodoView', false)
  }
  next()
}

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
          beforeEnter: beforeEnterProjectOrTodo,
          components: {
            default: Todo,
            todoDetail: TodoDetail
          }
        },
        {
          name: 'project',
          path: 'project',
          beforeEnter: beforeEnterProjectOrTodo,
          components: {
            default: Project,
            todoDetail: TodoDetail
          }
        }
      ]
    }
  ]
})
