export default function PlayerCard({ player, onClick }) {
  return (
    <div className="player-card" onClick={() => onClick?.(player)}>
      <div className="player-rank">#{player.rank}</div>
      <div className="player-info">
        <h3>{player.name}</h3>
        <span className="player-country">{player.country}</span>
      </div>
      <div className="player-meta">
        <span>Age {player.age}</span>
        <span>{player.hand}-handed</span>
        <span>Best on {player.surface}</span>
      </div>
      <div className="player-winrate">
        <div
          className="winrate-bar"
          style={{ width: `${player.winRate * 100}%` }}
        />
        <span>{Math.round(player.winRate * 100)}% win rate</span>
      </div>
    </div>
  )
}
