import Vue from 'vue'
import './plugins/vuetify'
import './plugins/eventBus'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import './style/common.scss'
import * as idb from 'idb'
import { initDB } from './lib/indexedDB'

window.Vue = Vue
window.idb = idb
window.initDB = initDB

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
