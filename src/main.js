import Vue from 'vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import './plugins/eventBus'
import './plugins/indexedDB'
import App from './App.vue'
import router from './router'
import store from './store'
// import './registerServiceWorker'
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
Vue.config.devtools = process.env.NODE_ENV === 'development'

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
