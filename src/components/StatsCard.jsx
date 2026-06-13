export default function StatsCard({ title, value, subtitle, color, icon }) {
  return (
    <div className="stats-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="stats-card-header">
        <span className="stats-card-icon">{icon}</span>
        <span className="stats-card-title">{title}</span>
      </div>
      <div className="stats-card-value">{value}</div>
      {subtitle && <div className="stats-card-subtitle">{subtitle}</div>}
    </div>
  )
}
