export function keyMissingWarning (id, key) {
  console.warn(`${id}: some key(${key}) is missing!`)
}

export class RefreshTimer {
  constructor (callback) {
    this._callback = callback
  }

  refresh (timeout) {
    this.clear()
    this._timeoutId = setTimeout(this._callback, timeout * 1000)
  }

  clear () {
    if (this._timeoutId) {
      console.log(`clear id ${this._timeoutId}`)
      clearTimeout(this._timeoutId)
    }
  }
}
