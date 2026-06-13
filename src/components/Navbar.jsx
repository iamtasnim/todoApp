import { NavLink } from 'react-router-dom'
import { useTodos } from '../contexts/TodoContext'

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/todos', label: 'Todos', icon: '📋' },
  { to: '/categories', label: 'Categories', icon: '🏷️' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Navbar() {
  const { state, dispatch } = useTodos()

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-logo">✓</span>
        <span className="nav-title">Todo App</span>
      </div>

      <div className="nav-links">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={link.to === '/'}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="nav-right">
        <button
          className="dark-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          title={state.darkMode ? 'Light mode' : 'Dark mode'}
        >
          {state.darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  )
}
