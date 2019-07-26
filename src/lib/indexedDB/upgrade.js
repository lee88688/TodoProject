export default [
  {
    dbVersion: 0,
    async upgradeCallback (database, oldVersion, newVersion) {
      database.createObjectStore('todos', { keyPath: 'id' })
      database.createObjectStore('archive', { keyPath: 'id' })
      database.createObjectStore('folders', { keyPath: 'id' })
      database.createObjectStore('projects', { keyPath: 'id' })
      database.createObjectStore('users', { keyPath: 'id' }) // store related user info
      let userObjectStore = database.createObjectStore('user') // store current user info
      await userObjectStore.transaction.done
      userObjectStore = database.transaction('user', 'readwrite').objectStore('user')
      userObjectStore.put('', 'name')
      userObjectStore.put([], 'projectList')
      userObjectStore.put([], 'folderList')
      await userObjectStore.transaction.done
    }
  }
]
