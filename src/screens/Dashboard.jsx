import { players } from '../data/players'
import { matches } from '../data/matches'

export default function Dashboard() {
  const topPlayer = [...players].sort((a, b) => a.rank - b.rank)[0]
  const recentMatch = [...matches].sort((a, b) => (a.date < b.date ? 1 : -1))[0]

  return (
    <div className="screen dashboard">
      <h1>Dashboard</h1>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">Players tracked</div>
          <div className="summary-value">{players.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Matches recorded</div>
          <div className="summary-value">{matches.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Top ranked player</div>
          <div className="summary-value">{topPlayer.name}</div>
          <div className="summary-sub">Rank #{topPlayer.rank}</div>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>Most Recent Match</h2>
        <div className="match-highlight">
          <div className="match-players-large">
            <span className={recentMatch.winner === recentMatch.player1 ? 'winner' : ''}>
              {recentMatch.player1}
            </span>
            <span className="vs">vs</span>
            <span className={recentMatch.winner === recentMatch.player2 ? 'winner' : ''}>
              {recentMatch.player2}
            </span>
          </div>
          <div className="match-score-large">{recentMatch.score}</div>
          <div className="match-details">
            {recentMatch.tournament} &middot; {recentMatch.surface} &middot; {recentMatch.date}
          </div>
        </div>
      </section>
    </div>
  )
}
