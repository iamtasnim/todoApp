import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTodos } from '../contexts/TodoContext'
import { getPriorityInfo, formatDateShort, isOverdue } from '../utils/helpers'

export default function TodoList({ todos, sortBy = 'order' }) {
  const { dispatch } = useTodos()
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const dragItem = useRef(null)
  const editInputRef = useRef(null)

  const sortedTodos = [...todos].sort((a, b) => {
    switch (sortBy) {
      case 'priority': {
        const order = { high: 0, medium: 1, low: 2, none: 3 }
        return order[a.priority] - order[b.priority]
      }
      case 'date': {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      case 'alpha':
        return a.text.localeCompare(b.text)
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return (a.order || 0) - (b.order || 0)
    }
  })

  function startEdit(todo) {
    setEditingId(todo.id)
    setEditText(todo.text)
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus()
        editInputRef.current.select()
      }
    }, 0)
  }

  function saveEdit(id) {
    const trimmed = editText.trim()
    if (!trimmed) return
    dispatch({ type: 'UPDATE_TODO', payload: { id, text: trimmed } })
    setEditingId(null)
  }

  function handleDragStart(index) {
    dragItem.current = index
  }

  function handleDragOver(e, index) {
    e.preventDefault()
    if (dragItem.current === null || dragItem.current === index) return
    const reordered = [...todos]
    const [moved] = reordered.splice(dragItem.current, 1)
    reordered.splice(index, 0, moved)
    const withOrder = reordered.map((t, i) => ({ ...t, order: i }))
    dispatch({ type: 'REORDER_TODOS', payload: withOrder })
    dragItem.current = index
  }

  if (sortedTodos.length === 0) {
    return <div className="empty-state">No todos match your filters.</div>
  }

  return (
    <ul className="todo-list">
      {sortedTodos.map((todo, index) => {
        const priority = getPriorityInfo(todo.priority)
        const overdue = !todo.completed && isOverdue(todo.dueDate)
        const subtaskCount = todo.subtasks?.length || 0
        const completedSubtasks = todo.subtasks?.filter(s => s.completed).length || 0

        return (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}
            draggable={sortBy === 'order'}
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDragEnd={() => { dragItem.current = null }}
          >
            <div className="todo-main">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
              />

              <div className="todo-content">
                {editingId === todo.id ? (
                  <input
                    ref={editInputRef}
                    className="edit-input"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onBlur={() => saveEdit(todo.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit(todo.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                  />
                ) : (
                  <Link to={`/todos/${todo.id}`} className="todo-text">
                    {todo.text}
                  </Link>
                )}

                <div className="todo-meta">
                  {priority.value !== 'none' && (
                    <span className="badge" style={{ background: priority.color }}>
                      {priority.label}
                    </span>
                  )}
                  {todo.dueDate && (
                    <span className={`badge ${overdue ? 'badge-overdue' : 'badge-date'}`}>
                      {overdue ? '⚠ ' : ''}{formatDateShort(todo.dueDate)}
                    </span>
                  )}
                  {subtaskCount > 0 && (
                    <span className="badge badge-subtask">
                      {completedSubtasks}/{subtaskCount}
                    </span>
                  )}
                  {todo.description && <span className="badge badge-note">📝</span>}
                </div>
              </div>

              <div className="todo-actions">
                <button className="action-btn" onClick={() => startEdit(todo)} title="Edit">
                  ✎
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
