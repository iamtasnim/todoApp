import { useRef, useState } from 'react'
import { useTodos } from '../contexts/TodoContext'

export default function Settings() {
  const { state, dispatch } = useTodos()
  const fileInputRef = useRef(null)
  const [importStatus, setImportStatus] = useState('')

  function handleExport() {
    const data = JSON.stringify(state.todos, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todos-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (Array.isArray(data)) {
          dispatch({ type: 'IMPORT_TODOS', payload: data })
          setImportStatus(`Successfully imported ${data.length} todos!`)
        } else {
          setImportStatus('Invalid file format. Expected an array of todos.')
        }
      } catch {
        setImportStatus('Invalid JSON file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Settings</h2>
      </div>

      <div className="settings-section">
        <h3>Appearance</h3>
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">Dark Mode</span>
            <span className="setting-desc">Toggle dark/light theme</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={state.darkMode}
              onChange={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">Export Todos</span>
            <span className="setting-desc">Download all todos as JSON</span>
          </div>
          <button className="btn-primary" onClick={handleExport}>
            Export
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">Import Todos</span>
            <span className="setting-desc">Import todos from a JSON file</span>
          </div>
          <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>

        {importStatus && (
          <div className={`import-status ${importStatus.includes('Successfully') ? 'success' : 'error'}`}>
            {importStatus}
          </div>
        )}

        <div className="setting-row danger-zone">
          <div className="setting-info">
            <span className="setting-label">Clear All Completed</span>
            <span className="setting-desc">Remove all completed todos permanently</span>
          </div>
          <button
            className="btn-danger"
            onClick={() => {
              if (window.confirm('Delete all completed todos?')) {
                dispatch({ type: 'CLEAR_COMPLETED' })
              }
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>Statistics</h3>
        <div className="stats-detail">
          <div className="stat-row">
            <span>Total todos</span>
            <strong>{state.todos.length}</strong>
          </div>
          <div className="stat-row">
            <span>Active</span>
            <strong>{state.todos.filter(t => !t.completed).length}</strong>
          </div>
          <div className="stat-row">
            <span>Completed</span>
            <strong>{state.todos.filter(t => t.completed).length}</strong>
          </div>
          <div className="stat-row">
            <span>Categories</span>
            <strong>{state.categories.length}</strong>
          </div>
          <div className="stat-row">
            <span>Subtasks</span>
            <strong>{state.todos.reduce((sum, t) => sum + (t.subtasks?.length || 0), 0)}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
