import Vue from 'vue'

const eventBus = {
  install (Vue, args) {
    Vue.prototype.$bus = new Vue()
  }
}

Vue.use(eventBus)
