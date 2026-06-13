import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTodos } from '../contexts/TodoContext'
import { PRIORITIES, formatDate, getPriorityInfo, isOverdue } from '../utils/helpers'

export default function TodoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useTodos()
  const todo = state.todos.find(t => t.id === Number(id))

  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriority, setEditPriority] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [subtaskText, setSubtaskText] = useState('')
  const [noteText, setNoteText] = useState('')

  if (!todo) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Todo not found.</p>
          <Link to="/todos" className="btn-primary" style={{ display: 'inline-block', marginTop: 16 }}>
            Back to Todos
          </Link>
        </div>
      </div>
    )
  }

  const priority = getPriorityInfo(todo.priority)
  const category = state.categories.find(c => c.id === todo.category)
  const overdue = !todo.completed && isOverdue(todo.dueDate)

  function startEditing() {
    setEditText(todo.text)
    setEditDescription(todo.description || '')
    setEditPriority(todo.priority)
    setEditDueDate(todo.dueDate || '')
    setEditCategory(todo.category || '')
    setIsEditing(true)
  }

  function saveEdit() {
    const trimmed = editText.trim()
    if (!trimmed) return
    dispatch({
      type: 'UPDATE_TODO',
      payload: { id: todo.id, text: trimmed, description: editDescription, priority: editPriority, dueDate: editDueDate, category: editCategory },
    })
    setIsEditing(false)
  }

  function addSubtask(e) {
    e.preventDefault()
    const trimmed = subtaskText.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD_SUBTASK', payload: { todoId: todo.id, text: trimmed } })
    setSubtaskText('')
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/todos" className="back-link">← Back to Todos</Link>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-check">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
            />
          </div>

          <div className="detail-title-area">
            {isEditing ? (
              <input
                className="edit-title-input"
                value={editText}
                onChange={e => setEditText(e.target.value)}
                autoFocus
              />
            ) : (
              <h3 className={`detail-title ${todo.completed ? 'completed' : ''}`}>
                {todo.text}
              </h3>
            )}

            <div className="detail-badges">
              {priority.value !== 'none' && (
                <span className="badge" style={{ background: priority.color }}>{priority.label}</span>
              )}
              {category && <span className="badge" style={{ background: category.color }}>{category.label}</span>}
              {todo.completed && <span className="badge" style={{ background: '#51cf66' }}>Completed</span>}
              {overdue && <span className="badge badge-overdue">⚠ Overdue</span>}
            </div>
          </div>

          <div className="detail-actions">
            {isEditing ? (
              <>
                <button className="btn-primary" onClick={saveEdit}>Save</button>
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={startEditing}>Edit</button>
                <button
                  className="btn-danger"
                  onClick={() => { dispatch({ type: 'DELETE_TODO', payload: todo.id }); navigate('/todos') }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="detail-edit-form">
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select value={editPriority} onChange={e => setEditPriority(e.target.value)}>
                  {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)}>
                  <option value="">None</option>
                  {state.categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="detail-body">
            {todo.description && (
              <div className="detail-section">
                <h4>Description</h4>
                <p className="detail-description">{todo.description}</p>
              </div>
            )}

            <div className="detail-section">
              <h4>Details</h4>
              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <span className="detail-info-label">Created</span>
                  <span className="detail-info-value">{formatDate(todo.createdAt)}</span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-info-label">Updated</span>
                  <span className="detail-info-value">{formatDate(todo.updatedAt)}</span>
                </div>
                {todo.dueDate && (
                  <div className="detail-info-item">
                    <span className="detail-info-label">Due Date</span>
                    <span className={`detail-info-value ${overdue ? 'overdue' : ''}`}>
                      {overdue ? '⚠ ' : ''}{formatDate(todo.dueDate)}
                    </span>
                  </div>
                )}
                {todo.completedAt && (
                  <div className="detail-info-item">
                    <span className="detail-info-label">Completed</span>
                    <span className="detail-info-value">{formatDate(todo.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h4>Subtasks ({todo.subtasks?.filter(s => s.completed).length || 0}/{todo.subtasks?.length || 0})</h4>
              <form className="subtask-form" onSubmit={addSubtask}>
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={subtaskText}
                  onChange={e => setSubtaskText(e.target.value)}
                />
                <button type="submit" className="btn-primary btn-sm">Add</button>
              </form>
              {todo.subtasks && todo.subtasks.length > 0 ? (
                <ul className="subtask-list">
                  {todo.subtasks.map(st => (
                    <li key={st.id} className={`subtask-item ${st.completed ? 'completed' : ''}`}>
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => dispatch({ type: 'TOGGLE_SUBTASK', payload: { todoId: todo.id, subtaskId: st.id } })}
                      />
                      <span className="subtask-text">{st.text}</span>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => dispatch({ type: 'DELETE_SUBTASK', payload: { todoId: todo.id, subtaskId: st.id } })}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="detail-empty">No subtasks yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
