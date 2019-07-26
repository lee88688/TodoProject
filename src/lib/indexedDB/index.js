import { openDB } from 'idb/with-async-ittr'
import upgradeList from './upgrade'

const DB_NAME = 'TodoProject'
const DB_VERSION = 2

export async function initDB () {
  const db = await openDB(DB_NAME, DB_VERSION, {
    async upgrade (database, oldVersion, newVersion, transaction) {
      for (let up of upgradeList) {
        if (up.dbVersion === oldVersion) {
          await up.upgradeCallback(database, oldVersion, newVersion)
          break
        }
      }
    }
  })
  return db
}

export const dbHelper = {
  instance: null,
  initStart: false,
  async getInstance () {
    if (this.instance !== null) { return this.instance }
    if (this.initStart) {
      const timeout = 500
      return new Promise((resolve, reject) => {
        const self = this
        let countDown = 5
        const waitInstance = () => {
          // todo: when this.initStart is false, try use getInstance again.
          if (self.instance !== null) {
            resolve(self.instance)
          } else if (countDown) {
            countDown--
            setTimeout(waitInstance, timeout)
          } else {
            reject(new Error('init indexedDB error'))
          }
        }
        setTimeout(waitInstance, timeout)
      })
    }
    this.initStart = true
    let db = null
    try {
      db = await initDB()
    } catch (e) {
      this.initStart = false
      console.error(e)
      throw e
    }
    this.instance = db
    this.initStart = false
    return this.instance
  }
}

export async function archiveTodo (todo) {
  const db = await dbHelper.getInstance()
  await db.put('archive', todo)
}
