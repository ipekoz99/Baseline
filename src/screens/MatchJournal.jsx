import Icon from '../components/Icon'
import MatchForm from './matchJournal/MatchForm'
import { useMatches, calcStats, avgRating, formatDate, RATING_KEYS, RATING_LABELS } from '../data/matchJournalData'
import { useState } from 'react'

// ─── Surface badge ─────────────────────────────────────────────────────────
function SurfaceBadge({ surface }) {
  if (!surface) return null
  const label = surface.charAt(0).toUpperCase() + surface.slice(1)
  return <span className={`surface-badge surface-badge--${surface}`}>{label}</span>
}

// ─── Result badge ──────────────────────────────────────────────────────────
function ResultBadge({ result }) {
  return (
    <span className={`result-badge result-badge--${result}`}>
      {result === 'win' ? 'W' : 'L'}
    </span>
  )
}

// ─── Stats bar ─────────────────────────────────────────────────────────────
function StatsBar({ matches }) {
  const { wins, losses, winRate, recentForm, bestSurface } = calcStats(matches)
  const surfaceLabel = bestSurface
    ? `${bestSurface[0].charAt(0).toUpperCase() + bestSurface[0].slice(1)} · ${Math.round(bestSurface[1].w / bestSurface[1].n * 100)}%`
    : null

  return (
    <div className="journal-stats">
      <div className="stats-top-row">
        <div className="stats-record">
          <span className="record-wl">{wins}–{losses}</span>
          <span className="record-label">W–L</span>
        </div>
        <div className="stats-divider" />
        <div className="stats-record">
          <span className="record-wl">{winRate}%</span>
          <span className="record-label">Win Rate</span>
        </div>
        {surfaceLabel && (
          <>
            <div className="stats-divider" />
            <div className="stats-record">
              <span className="record-wl">{surfaceLabel}</span>
              <span className="record-label">Best Surface</span>
            </div>
          </>
        )}
      </div>

      {recentForm.length > 0 && (
        <div className="recent-form">
          <span className="recent-form-label">Recent</span>
          <div className="form-dots">
            {recentForm.map((r, i) => (
              <span key={i} className={`form-dot form-dot--${r}`} aria-label={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Match card (list item) ────────────────────────────────────────────────
function MatchCard({ match, onClick }) {
  const avg = avgRating(match.ratings)
  return (
    <button className={`match-card match-card--${match.result}`} onClick={onClick}>
      <ResultBadge result={match.result} />
      <div className="match-card-body">
        <div className="match-card-top">
          <span className="match-opponent">{match.opponent}</span>
          <span className="match-card-date">{formatDate(match.date)}</span>
        </div>
        <div className="match-card-meta">
          {match.score && <span className="match-score-text">{match.score}</span>}
          <SurfaceBadge surface={match.surface} />
          {match.round && <span className="round-badge">{match.round}</span>}
          {match.tournament && <span className="match-event">{match.tournament}</span>}
        </div>
        {avg > 0 && (
          <div className="match-card-bottom">
            <div className="avg-rating-dots">
              {[1,2,3,4,5].map((n) => (
                <span key={n} className={`mini-dot${n <= Math.round(avg) ? ' mini-dot--filled' : ''}`} />
              ))}
            </div>
            <span className="avg-rating-label">Avg {avg}/5</span>
          </div>
        )}
      </div>
      <Icon name="chevron-right" size={16} />
    </button>
  )
}

// ─── Match detail ──────────────────────────────────────────────────────────
function MatchDetail({ match, onBack, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="match-detail">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          <Icon name="chevron-left" size={20} />
        </button>
        <h2 className="detail-title">vs {match.opponent}</h2>
      </div>

      {/* Hero row */}
      <div className="detail-hero">
        <ResultBadge result={match.result} />
        {match.score && <span className="detail-score">{match.score}</span>}
        <SurfaceBadge surface={match.surface} />
        {match.round && <span className="round-badge">{match.round}</span>}
      </div>

      {/* Meta row */}
      <div className="detail-meta-row">
        <span className="detail-meta-item">{formatDate(match.date)}</span>
        {match.tournament && <span className="detail-meta-item">{match.tournament}</span>}
        {match.duration && <span className="detail-meta-item">{match.duration} min</span>}
      </div>

      {/* Ratings */}
      {RATING_KEYS.some((k) => match.ratings?.[k] > 0) && (
        <div className="detail-section">
          <p className="detail-section-label">Performance</p>
          <div className="ratings-detail-grid">
            {RATING_KEYS.map((key) => {
              const val = match.ratings?.[key] ?? 0
              if (val === 0) return null
              return (
                <div key={key} className="detail-rating-row">
                  <span className="detail-rating-label">{RATING_LABELS[key]}</span>
                  <div className="detail-rating-bar-track">
                    <div
                      className="detail-rating-bar-fill"
                      style={{ width: `${val / 5 * 100}%` }}
                    />
                  </div>
                  <span className="detail-rating-num">{val}/5</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Notes */}
      {match.notes && (
        <div className="detail-section">
          <p className="detail-section-label">Match Notes</p>
          <p className="detail-notes-text">{match.notes}</p>
        </div>
      )}

      {/* Improve */}
      {match.improve && (
        <div className="detail-section">
          <p className="detail-section-label">What to Improve</p>
          <p className="detail-notes-text detail-improve">{match.improve}</p>
        </div>
      )}

      {/* Delete */}
      <div className="detail-delete-area">
        {confirmDelete ? (
          <div className="delete-confirm-row">
            <span className="delete-confirm-text">Delete this match?</span>
            <button className="delete-confirm-btn" onClick={() => onDelete(match.id)}>Yes, delete</button>
            <button className="delete-cancel-btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>
        ) : (
          <button className="delete-match-btn" onClick={() => setConfirmDelete(true)}>
            Delete Match
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main screen ───────────────────────────────────────────────────────────
export default function MatchJournal({ onBack }) {
  const { matches, addMatch, deleteMatch } = useMatches()
  const [view, setView] = useState('list')   // 'list' | 'form' | 'detail'
  const [selected, setSelected] = useState(null)

  if (view === 'form') {
    return (
      <div className="section-screen">
        <header className="section-screen-header">
          <button className="back-btn" onClick={() => setView('list')} aria-label="Back">
            <Icon name="chevron-left" size={20} />
          </button>
          <h1 className="section-screen-title">Add Match</h1>
        </header>
        <MatchForm
          onSave={(m) => { addMatch(m); setView('list') }}
          onCancel={() => setView('list')}
        />
      </div>
    )
  }

  if (view === 'detail' && selected) {
    return (
      <div className="section-screen">
        <MatchDetail
          match={selected}
          onBack={() => setView('list')}
          onDelete={(id) => { deleteMatch(id); setView('list') }}
        />
      </div>
    )
  }

  // ── List view ─────────────────────────────────────────────────────────
  return (
    <div className="section-screen">
      <header className="section-screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Back to home">
          <Icon name="chevron-left" size={20} />
        </button>
        <h1 className="section-screen-title">Match Journal</h1>
        <button
          className="add-match-btn"
          onClick={() => setView('form')}
          aria-label="Add match"
        >
          <Icon name="plus" size={16} />
          Add
        </button>
      </header>

      {matches.length > 0 && <StatsBar matches={matches} />}

      <div className="match-list-journal">
        {matches.length === 0 ? (
          <div className="journal-empty">
            <p>No matches yet.</p>
            <p>Tap <strong>Add</strong> to log your first match.</p>
          </div>
        ) : (
          matches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              onClick={() => { setSelected(m); setView('detail') }}
            />
          ))
        )}
      </div>
    </div>
  )
}
