export const PRIORITIES = [
  { value: 'none', label: 'None', color: '#868e96' },
  { value: 'low', label: 'Low', color: '#51cf66' },
  { value: 'medium', label: 'Medium', color: '#fcc419' },
  { value: 'high', label: 'High', color: '#ff6b6b' },
]

export const DEFAULT_CATEGORIES = [
  { id: 'work', label: 'Work', color: '#4dabf7' },
  { id: 'personal', label: 'Personal', color: '#da77f2' },
  { id: 'shopping', label: 'Shopping', color: '#fcc419' },
  { id: 'health', label: 'Health', color: '#51cf66' },
  { id: 'finance', label: 'Finance', color: '#20c997' },
]

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const day = 86400000

  if (diff < day && d.getDate() === now.getDate()) {
    return `Today at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  }
  if (diff < 2 * day && d.getDate() === now.getDate() - 1) {
    return `Yesterday at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  }
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

export function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function isOverdue(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr) < today
}

export function isToday(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  return d.getTime() === today.getTime()
}

export function isThisWeek(dateStr) {
  if (!dateStr) return false
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)
  const d = new Date(dateStr)
  return d >= startOfWeek && d < endOfWeek
}

export function isThisMonth(dateStr) {
  if (!dateStr) return false
  const now = new Date()
  const d = new Date(dateStr)
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export function getPriorityInfo(value) {
  return PRIORITIES.find(p => p.value === value) || PRIORITIES[0]
}

export function pluralize(count, singular, plural) {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural || singular + 's'}`
}
