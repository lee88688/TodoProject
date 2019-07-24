import Vue from 'vue'
import { dbHelper } from '@/lib/indexedDB'

const indexedDBPlugin = {
  async install (Vue) {
    const db = await dbHelper.getInstance()
    window.db = db // fixme: debug use
    Vue.prototype.$db = db
  }
}

Vue.use(indexedDBPlugin)
