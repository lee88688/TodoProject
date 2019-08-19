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

export function removeArrayElement (array, callback) {
  const index = array.findIndex(callback)
  index >= 0 && array.splice(index, 1)
}

export function removeUndefinedKey (obj) {
  return Object.keys(obj).forEach(key => {
    obj[key] === undefined && (delete obj[key])
  })
}

export function isSameDay (d1, d2) {
  return d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
}

export function isInDateRange (startDate, stopDate, date) {
  return (date.getTime() >= startDate.getTime() && date.getTime() <= stopDate.getTime())
}

const weekDayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
export function getWeekDayNameFromDate (date) {
  const day = date.getDay()
  return weekDayName[day]
}

export const repeatName = ['day', 'week', 'month', 'year']
export function nextPeriodDate (periodName, currentDate) {
}
