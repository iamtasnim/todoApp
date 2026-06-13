import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Todos from './pages/Todos'
import TodoDetail from './pages/TodoDetail'
import Categories from './pages/Categories'
import Settings from './pages/Settings'
import './App.css'

export default function App() {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/todos/:id" element={<TodoDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={
            <div className="page">
              <div className="empty-state">
                <h2>404</h2>
                <p>Page not found.</p>
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}
