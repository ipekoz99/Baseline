import Icon from '../components/Icon'

const STATS = [
  { label: 'Rank',      value: '#12' },
  { label: 'Matches',   value: '147' },
  { label: 'Win Rate',  value: '72%' },
  { label: 'Streak',    value: '14d' },
]

const ACTIVITY = [
  { date: 'Today',       text: 'Completed clay court session', icon: 'activity' },
  { date: 'Yesterday',   text: 'Logged nutrition · 2,380 kcal', icon: 'leaf' },
  { date: 'Apr 10',      text: 'Win vs Kenji Tanaka · 6-4 6-2', icon: 'trophy' },
  { date: 'Apr 9',       text: 'Recovery · Sleep score 89', icon: 'heart-pulse' },
]

export default function Profile() {
  return (
    <div className="screen profile-screen">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">AR</div>
        <h1 className="profile-name">Alex Rivera</h1>
        <p className="profile-meta">USA · Right-handed · Clay</p>
      </div>

      {/* Stats row */}
      <div className="profile-stats">
        {STATS.map((s) => (
          <div key={s.label} className="profile-stat">
            <div className="profile-stat-value">{s.value}</div>
            <div className="profile-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <section className="profile-section">
        <h2 className="section-heading">Recent Activity</h2>
        <div className="activity-list">
          {ACTIVITY.map((item, i) => (
            <div key={i} className="activity-item">
              <div className="activity-icon">
                <Icon name={item.icon} size={16} />
              </div>
              <div className="activity-body">
                <div className="activity-text">{item.text}</div>
                <div className="activity-date">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info rows */}
      <section className="profile-section">
        <h2 className="section-heading">Player Details</h2>
        <div className="info-list">
          {[
            ['Age',          '24'],
            ['Country',      'United States'],
            ['Playing hand', 'Right'],
            ['Best surface', 'Clay'],
            ['Coach',        'Maria Santos'],
            ['Academy',      'Baseline Performance'],
          ].map(([label, value]) => (
            <div key={label} className="info-row">
              <span className="info-label">{label}</span>
              <span className="info-value">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
