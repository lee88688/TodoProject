import { openDB } from 'idb'
import upgradeList from './upgrade'

const DB_NAME = 'todoProject'
const DB_VERSION = 2

export async function initDB () {
  const db = await openDB(DB_NAME, DB_VERSION, {
    async upgrade (database, oldVersion, newVersion, transaction) {
      console.log(oldVersion)
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
