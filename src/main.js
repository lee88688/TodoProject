import Vue from 'vue'
import './plugins/vuetify'
import './plugins/eventBus'
import './plugins/indexedDB'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import './style/common.scss'
import * as idb from 'idb'
import { initDB, dbHelper } from './lib/indexedDB'

// for debug
window.Vue = Vue
window.idb = idb
window.initDB = initDB
window.dbHelper = dbHelper

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
