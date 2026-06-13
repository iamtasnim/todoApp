import { useState } from 'react'
import { useTodos } from '../contexts/TodoContext'

const PRESET_COLORS = [
  '#4dabf7', '#da77f2', '#fcc419', '#51cf66', '#ff6b6b',
  '#20c997', '#ff922b', '#845ef7', '#f06595', '#0ca678',
  '#74c0fc', '#b197fc', '#ffd43b', '#69db7c', '#ff8787',
]

export default function Categories() {
  const { state, dispatch } = useTodos()
  const [editingId, setEditingId] = useState(null)
  const [editLabel, setEditLabel] = useState('')
  const [editColor, setEditColor] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newColor, setNewColor] = useState('#4dabf7')

  function startEdit(cat) {
    setEditingId(cat.id)
    setEditLabel(cat.label)
    setEditColor(cat.color)
  }

  function saveEdit() {
    const trimmed = editLabel.trim()
    if (!trimmed) return
    dispatch({ type: 'UPDATE_CATEGORY', payload: { id: editingId, label: trimmed, color: editColor } })
    setEditingId(null)
  }

  function addCategory() {
    const trimmed = newLabel.trim()
    if (!trimmed) return
    dispatch({
      type: 'ADD_CATEGORY',
      payload: { id: Date.now().toString(), label: trimmed, color: newColor },
    })
    setNewLabel('')
    setNewColor('#4dabf7')
    setShowNew(false)
  }

  const categoryCounts = {}
  state.todos.forEach(t => {
    if (t.category) {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1
    }
  })

  return (
    <div className="page">
      <div className="page-header">
        <h2>Categories</h2>
        <button className="btn-primary" onClick={() => setShowNew(!showNew)}>
          {showNew ? 'Cancel' : '+ New Category'}
        </button>
      </div>

      {showNew && (
        <div className="category-form-card">
          <input
            type="text"
            placeholder="Category name"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
            autoFocus
          />
          <div className="color-picker">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                className={`color-swatch ${newColor === color ? 'selected' : ''}`}
                style={{ background: color }}
                onClick={() => setNewColor(color)}
              />
            ))}
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={addCategory}>Add</button>
            <button className="btn-secondary" onClick={() => setShowNew(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="categories-grid">
        {state.categories.map(cat => {
          const count = categoryCounts[cat.id] || 0
          return (
            <div key={cat.id} className="category-card" style={{ borderTop: `3px solid ${cat.color}` }}>
              {editingId === cat.id ? (
                <div className="cat-edit">
                  <input
                    value={editLabel}
                    onChange={e => setEditLabel(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    autoFocus
                  />
                  <div className="color-picker sm">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        className={`color-swatch sm ${editColor === color ? 'selected' : ''}`}
                        style={{ background: color }}
                        onClick={() => setEditColor(color)}
                      />
                    ))}
                  </div>
                  <div className="form-actions">
                    <button className="btn-primary btn-sm" onClick={saveEdit}>Save</button>
                    <button className="btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="cat-header">
                    <span className="cat-dot" style={{ background: cat.color }} />
                    <span className="cat-label">{cat.label}</span>
                  </div>
                  <div className="cat-count">{count} todo{count !== 1 ? 's' : ''}</div>
                  <div className="cat-actions">
                    <button className="action-btn" onClick={() => startEdit(cat)}>✎</button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => dispatch({ type: 'DELETE_CATEGORY', payload: cat.id })}
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
