import clone from 'lodash/clone'
import store from '../store'
import { prefixTypes } from '../store/modules/user'

export function folderDependencyCheck () {
  const folderList = store.state.user.folderList
  folderList.forEach(f => {
    const folder = store.state.user.folders[f]
    const removeTodos = new Set()
    if (folder) {
      const folderId = f
      folder.undos && folder.undos.forEach(t => {
        const todo = store.state.user.todos[t]
        if (todo) {
          if (todo.folder !== folderId) {
            console.log(`todo: ${todo.name}(${todo.id}), change ${todo.folder} to ${folderId}`)
            store.commit(prefixTypes.MODIFY_TODO, { id: todo.id, folder: folderId })
          }
        } else {
          console.log(`remove unknown todo: ${t}`)
          removeTodos.add(todo.id)
        }
      })
    } else {
      // todo: folder not exist
    }
    if (!removeTodos.size) return
    const undos = clone(folder.undos)
    const newUndos = []
    for (const t of undos) {
      if (!removeTodos.has(t)) {
        newUndos.push(t)
      }
    }
    store.commit(prefixTypes.MODIFY_FOLDER, { id: f, undos: newUndos })
  })
}

window.folderDependencyCheck = folderDependencyCheck
