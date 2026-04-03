export default function StatBar({ label, value, max, format }) {
  const pct = Math.min(value / max, 1)
  const display = format ? format(value) : value

  return (
    <div className="stat-bar">
      <div className="stat-label">{label}</div>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${pct * 100}%` }} />
      </div>
      <div className="stat-value">{display}</div>
    </div>
  )
}
