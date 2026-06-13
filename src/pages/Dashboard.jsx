import { useTodos } from '../contexts/TodoContext'
import StatsCard from '../components/StatsCard'
import { isOverdue, isToday, isThisWeek, formatDateShort } from '../utils/helpers'

export default function Dashboard() {
  const { state } = useTodos()
  const { todos } = state

  const total = todos.length
  const active = todos.filter(t => !t.completed).length
  const completed = todos.filter(t => t.completed).length
  const overdue = todos.filter(t => !t.completed && isOverdue(t.dueDate)).length
  const dueToday = todos.filter(t => !t.completed && isToday(t.dueDate)).length
  const dueThisWeek = todos.filter(t => !t.completed && isThisWeek(t.dueDate)).length
  const highPriority = todos.filter(t => !t.completed && t.priority === 'high').length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const upcomingTodos = todos
    .filter(t => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const recentTodos = todos
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="page-subtitle">Overview of your tasks</p>
      </div>

      <div className="stats-grid">
        <StatsCard title="Total Tasks" value={total} color="#4dabf7" icon="📋" subtitle={`${active} active, ${completed} done`} />
        <StatsCard title="Overdue" value={overdue} color="#ff6b6b" icon="⚠️" subtitle="Requires attention" />
        <StatsCard title="Due Today" value={dueToday} color="#fcc419" icon="📅" subtitle={`${dueThisWeek} due this week`} />
        <StatsCard title="High Priority" value={highPriority} color="#ff6b6b" icon="🔴" subtitle="Needs immediate focus" />
        <StatsCard title="Completion Rate" value={`${completionRate}%`} color="#51cf66" icon="✅" subtitle={`${completed} of ${total} done`} />
        <StatsCard title="Categories" value={state.categories.length} color="#da77f2" icon="🏷️" subtitle="Task categories" />
      </div>

      <div className="dashboard-grid">
        <div className="dash-card">
          <h3>Upcoming Deadlines</h3>
          {upcomingTodos.length > 0 ? (
            <ul className="dash-list">
              {upcomingTodos.map(todo => (
                <li key={todo.id} className="dash-item">
                  <span className="dash-item-text">{todo.text}</span>
                  <span className={`dash-item-date ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
                    {formatDateShort(todo.dueDate)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-empty">No upcoming deadlines. Great job!</p>
          )}
        </div>

        <div className="dash-card">
          <h3>Recently Added</h3>
          {recentTodos.length > 0 ? (
            <ul className="dash-list">
              {recentTodos.map(todo => (
                <li key={todo.id} className="dash-item">
                  <span className={`dash-item-text ${todo.completed ? 'completed' : ''}`}>
                    {todo.text}
                  </span>
                  <span className="dash-item-date">
                    {new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-empty">No todos yet. Start adding some!</p>
          )}
        </div>
      </div>
    </div>
  )
}
