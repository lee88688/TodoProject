import { isSameDay } from '@/lib/utils'

export function dateColor (date, useText = false) {
  if (!date) return ''
  let current = new Date()
  current.setHours(0, 0, 0, 0)
  current = current.getTime()
  const expiredDate = new Date(date).getTime()
  if (useText) {
    return expiredDate > current ? 'blue--text text--lighten-2' : 'red--text text--lighten-1'
  } else {
    return expiredDate > current ? 'blue lighten-2' : 'red lighten-1'
  }
}

function transformDate (date) {
  const dateBackup = date
  const today = new Date()
  date = new Date(date)
  if (isSameDay(today, date)) {
    return 'days.today'
  }
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (isSameDay(yesterday, date)) {
    return 'days.yesterday'
  }
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (isSameDay(tomorrow, date)) {
    return 'days.tomorrow'
  }
  return dateBackup
}

export function todoTransform (t) {
  const { id, name, complete } = t
  const attachment = !t.attachment ? false : (t.attachment.length > 0)
  // subtask
  const totalSubtask = t.subtasks ? t.subtasks.length : 0
  const reserveSubtask = !totalSubtask ? 0 : t.subtasks.filter(s => s.complete).length
  // comment
  const comment = !t.comments ? false : (t.comments.length > 0)
  // expired date
  const showExpiredDate = !!t.expired_date
  const expiredDate = transformDate(t.expired_date)
  const expiredDateColor = dateColor(t.expired_date, true)
  // star
  const star = !!t.star
  return { id, name, complete, attachment, totalSubtask, reserveSubtask, comment, showExpiredDate, expiredDate, expiredDateColor, star }
}
