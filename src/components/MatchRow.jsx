export default function MatchRow({ match }) {
  return (
    <div className="match-row">
      <div className="match-date">{match.date}</div>
      <div className="match-players">
        <span className={match.winner === match.player1 ? 'winner' : ''}>
          {match.player1}
        </span>
        <span className="vs">vs</span>
        <span className={match.winner === match.player2 ? 'winner' : ''}>
          {match.player2}
        </span>
      </div>
      <div className="match-score">{match.score}</div>
      <div className="match-meta">
        <span className={`surface surface-${match.surface.toLowerCase()}`}>
          {match.surface}
        </span>
        <span className="tournament">{match.tournament}</span>
      </div>
    </div>
  )
}
