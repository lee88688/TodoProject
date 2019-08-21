import { dbHelper } from '../indexedDB'

console.log('this is in the worker.')

self.onconnect = async function () {
  const db = await dbHelper.getInstance()
  console.log(await db.get('user', 'projectList'))
}

self.onmessage = async function (event) {
  console.log(event.data)
}
