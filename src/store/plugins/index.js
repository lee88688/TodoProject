import { dbHelper } from '@/lib/indexedDB'
import { prefixTypes as userMutations } from '../modules/user'

export async function readIndexedDBPlugin (store) {
  readIndexedDBPlugin.isReady = false
  const db = await dbHelper.getInstance()
  // todos
  let tx = db.transaction(['folders', 'todos', 'projects'])
  for await (const cursor of tx.objectStore('todos')) {
    store.commit(userMutations.ADD_TODO, cursor.value)
  }
  // folders
  for await (const cursor of tx.objectStore('folders')) {
    store.commit(userMutations.ADD_FOLDER, cursor.value)
  }
  // projects
  for await (const cursor of tx.objectStore('projects')) {
    store.commit(userMutations.ADD_PROJECT, cursor.value)
  }
  // getting user info must do at last
  const projectList = await db.get('user', 'projectList')
  store.commit(userMutations.MODIFY_PROJECT_LIST, projectList)
  const folderList = await db.get('user', 'folderList')
  store.commit(userMutations.MODIFY_FOLDER_LIST, folderList)
  await tx.done
  readIndexedDBPlugin.isReady = true
}

readIndexedDBPlugin.ready = async function () {
  return new Promise(resolve => {
    const timeout = 500
    const waitReady = () => {
      if (readIndexedDBPlugin.isReady) {
        resolve(readIndexedDBPlugin.isReady)
      }
      setTimeout(waitReady, timeout)
    }
    setTimeout(waitReady, timeout)
  })
}

export async function syncStore (store) {
  await readIndexedDBPlugin.ready()
  const db = await dbHelper.getInstance()
  store.subscribe(async mutation => {
    switch (mutation.type) {
      case userMutations.MODIFY_FOLDER_LIST: {
        await db.put('user', mutation.payload, 'folderList')
        break
      }
      case userMutations.MODIFY_PROJECT_LIST: {
        await db.put('user', mutation.payload, 'projectList')
        break
      }
      // todos
      case userMutations.ADD_TODO:
      case userMutations.MODIFY_TODO: {
        const { id } = mutation.payload
        const todo = store.state.user.todos[id]
        await db.put('todos', todo)
        break
      }
      case userMutations.DELETE_TODO: {
        const id = mutation.payload
        await db.delete('todos', id)
        break
      }
      // folders
      case userMutations.ADD_FOLDER:
      case userMutations.MODIFY_FOLDER: {
        const { id } = mutation.payload
        const folder = store.state.user.folders[id]
        await db.put('folders', folder)
        break
      }
      case userMutations.DELETE_FOLDER: {
        const id = mutation.payload
        await db.delete('folders', id)
        break
      }
      // projects
      case userMutations.ADD_PROJECT:
      case userMutations.MODIFY_PROJECT: {
        const { id } = mutation.payload
        const project = store.state.user.projects[id]
        await db.put('projects', project)
        break
      }
      case userMutations.DELETE_PROJECT: {
        const id = mutation.payload
        await db.delete('projects', id)
        break
      }
      default:
        break
    }
  })
}
