import { useState } from 'react'
import { players } from '../data/players'
import { stats } from '../data/stats'
import PlayerCard from '../components/PlayerCard'
import StatBar from '../components/StatBar'

export default function Players() {
  const [selected, setSelected] = useState(null)
  const playerStats = selected ? stats[selected.id] : null

  return (
    <div className="screen players">
      <h1>Players</h1>

      <div className="players-layout">
        <div className="player-list">
          {players.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              onClick={setSelected}
            />
          ))}
        </div>

        {selected && playerStats && (
          <div className="player-detail">
            <h2>{selected.name}</h2>
            <p className="player-detail-meta">
              Rank #{selected.rank} &middot; {selected.country} &middot; {selected.hand}-handed
            </p>
            <div className="stats-list">
              <StatBar label="Aces" value={playerStats.aces} max={250} />
              <StatBar label="Double Faults" value={playerStats.doubleFaults} max={100} />
              <StatBar
                label="1st Serve %"
                value={playerStats.firstServePercent}
                max={1}
                format={(v) => `${Math.round(v * 100)}%`}
              />
              <StatBar
                label="Break Points Converted"
                value={playerStats.breakPointsConverted}
                max={1}
                format={(v) => `${Math.round(v * 100)}%`}
              />
              <StatBar
                label="Avg Rally Length"
                value={playerStats.avgRallyLength}
                max={10}
                format={(v) => `${v} shots`}
              />
            </div>
          </div>
        )}

        {!selected && (
          <div className="player-detail placeholder">
            <p>Select a player to view stats</p>
          </div>
        )}
      </div>
    </div>
  )
}
