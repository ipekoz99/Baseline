import { useState } from 'react'
import { matches } from '../data/matches'
import MatchRow from '../components/MatchRow'

const SURFACES = ['All', 'Clay', 'Hard', 'Grass']

export default function Matches() {
  const [surface, setSurface] = useState('All')

  const filtered =
    surface === 'All' ? matches : matches.filter((m) => m.surface === surface)

  return (
    <div className="screen matches">
      <h1>Matches</h1>

      <div className="filter-bar">
        {SURFACES.map((s) => (
          <button
            key={s}
            className={surface === s ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setSurface(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="match-list">
        {filtered.length === 0 ? (
          <p className="empty">No matches found for this surface.</p>
        ) : (
          filtered.map((m) => <MatchRow key={m.id} match={m} />)
        )}
      </div>
    </div>
  )
}
