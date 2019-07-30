export function dateColor (date, useText = false) {
  if (!date) return ''
  const current = new Date().getTime()
  const expiredDate = new Date(date).getTime()
  if (useText) {
    return expiredDate > current ? 'blue--text text--lighten-2' : 'red--text text--lighten-1'
  } else {
    return expiredDate > current ? 'blue lighten-2' : 'red lighten-1'
  }
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
  const expiredDate = t.expired_date
  const expiredDateColor = dateColor(expiredDate, true)
  // star
  const star = !!t.star
  return { id, name, complete, attachment, totalSubtask, reserveSubtask, comment, showExpiredDate, expiredDate, expiredDateColor, star }
}
