import { useState } from 'react'
import { useTodos } from '../contexts/TodoContext'
import TodoList from '../components/TodoList'
import { PRIORITIES } from '../utils/helpers'

export default function Todos() {
  const { state, dispatch } = useTodos()
  const [text, setText] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('none')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('order')

  function handleAdd(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    dispatch({
      type: 'ADD_TODO',
      payload: { text: trimmed, description, priority, dueDate, category },
    })
    setText('')
    setDescription('')
    setPriority('none')
    setDueDate('')
    setCategory('')
    setShowForm(false)
  }

  const filteredTodos = state.todos.filter(t => {
    if (search && !t.text.toLowerCase().includes(search.toLowerCase()) && !t.description?.toLowerCase().includes(search.toLowerCase())) return false
    switch (filter) {
      case 'active': return !t.completed
      case 'completed': return t.completed
      case 'overdue': return !t.completed && t.dueDate && new Date(t.dueDate) < new Date(new Date().toDateString())
      case 'today': {
        const today = new Date().toISOString().slice(0, 10)
        return t.dueDate === today || (!t.dueDate && !t.completed)
      }
      case 'high': return !t.completed && t.priority === 'high'
      case 'no-date': return !t.dueDate && !t.completed
      default: return true
    }
  })

  return (
    <div className="page">
      <div className="page-header">
        <h2>Todos</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Todo'}
        </button>
      </div>

      {showForm && (
        <form className="todo-form" onSubmit={handleAdd}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={text}
              onChange={e => setText(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Add more details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}>
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">None</option>
                {state.categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary">Add Todo</button>
        </form>
      )}

      <div className="toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search todos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-controls">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
            <option value="today">Today</option>
            <option value="high">High Priority</option>
            <option value="no-date">No Date</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="order">Custom</option>
            <option value="priority">Priority</option>
            <option value="date">Due Date</option>
            <option value="alpha">A-Z</option>
            <option value="created">Newest</option>
          </select>
        </div>
      </div>

      <TodoList todos={filteredTodos} sortBy={sortBy} />

      {state.todos.some(t => t.completed) && (
        <div className="bulk-bar">
          <span className="bulk-info">
            {state.todos.filter(t => t.completed).length} completed
          </span>
          <button
            className="btn-danger"
            onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
          >
            Clear Completed
          </button>
        </div>
      )}
    </div>
  )
}
