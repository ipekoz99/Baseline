import { useState } from 'react'
import { SURFACES, ROUNDS, RATING_KEYS, RATING_LABELS } from '../../data/matchJournalData'

// ─── Shared primitives (same style as DailyForm) ──────────────────────────

function ChipGroup({ options, value, onChange }) {
  return (
    <div className="chip-group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`chip${value === o.value ? ' chip--active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function RatingSelector({ label, value, onChange }) {
  return (
    <div className="rating-row">
      <span className="rating-label">{label}</span>
      <div className="rating-dots">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`rating-dot${n <= value ? ' rating-dot--filled' : ''}`}
            onClick={() => onChange(n)}
            aria-label={`${label} ${n} of 5`}
          />
        ))}
      </div>
      <span className="rating-num">{value > 0 ? `${value}/5` : '—'}</span>
    </div>
  )
}

// ─── Default form state ────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]

const EMPTY = {
  result:     'win',
  opponent:   '',
  date:       today,
  score:      '',
  surface:    '',
  tournament: '',
  round:      '',
  duration:   '',
  ratings:    { serve: 0, return: 0, forehand: 0, backhand: 0, movement: 0, mental: 0 },
  notes:      '',
  improve:    '',
}

// ─── Form ──────────────────────────────────────────────────────────────────

export default function MatchForm({ onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY)

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }))
  const setRating = (key, val) =>
    setForm((p) => ({ ...p, ratings: { ...p.ratings, [key]: val } }))

  const canSave = form.opponent.trim() && form.surface && form.date

  function handleSubmit(e) {
    e.preventDefault()
    if (canSave) onSave(form)
  }

  return (
    <form className="daily-form" onSubmit={handleSubmit}>

      {/* ── Result + core details ──────────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">Match Details</p>

        <div className="form-field">
          <label className="form-label">Result</label>
          <div className="result-toggle">
            <button
              type="button"
              className={`result-btn result-btn--win${form.result === 'win' ? ' result-btn--active-win' : ''}`}
              onClick={() => set('result', 'win')}
            >
              Win
            </button>
            <button
              type="button"
              className={`result-btn result-btn--loss${form.result === 'loss' ? ' result-btn--active-loss' : ''}`}
              onClick={() => set('result', 'loss')}
            >
              Loss
            </button>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Opponent</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. K. Tanaka"
            value={form.opponent}
            onChange={(e) => set('opponent', e.target.value)}
          />
        </div>

        <div className="form-row-2">
          <div className="form-field">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="text-input"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Score</label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g. 6-4, 7-5"
              value={form.score}
              onChange={(e) => set('score', e.target.value)}
            />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Court Surface</label>
          <ChipGroup options={SURFACES} value={form.surface} onChange={(v) => set('surface', v)} />
        </div>
      </div>

      {/* ── Event details (optional) ───────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">Event <span className="form-section-optional">optional</span></p>

        <div className="form-field">
          <label className="form-label">Tournament / Event</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. Spring Open"
            value={form.tournament}
            onChange={(e) => set('tournament', e.target.value)}
          />
        </div>

        <div className="form-row-2">
          <div className="form-field">
            <label className="form-label">Round</label>
            <ChipGroup options={ROUNDS} value={form.round} onChange={(v) => set('round', v)} />
          </div>
          <div className="form-field">
            <label className="form-label">Duration (min)</label>
            <input
              type="number"
              className="text-input"
              placeholder="e.g. 90"
              min="10" max="300"
              value={form.duration}
              onChange={(e) => set('duration', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Performance ratings ────────────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">Performance <span className="form-section-optional">tap to rate</span></p>
        <div className="ratings-form-grid">
          {RATING_KEYS.map((key) => (
            <RatingSelector
              key={key}
              label={RATING_LABELS[key]}
              value={form.ratings[key]}
              onChange={(v) => setRating(key, v)}
            />
          ))}
        </div>
      </div>

      {/* ── Notes ─────────────────────────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">Match Notes</p>

        <div className="form-field">
          <label className="form-label">How did it go?</label>
          <textarea
            className="textarea"
            rows={3}
            placeholder="Key moments, patterns that worked, how you felt…"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label">What to improve</label>
          <textarea
            className="textarea"
            rows={2}
            placeholder="Specific areas to work on in training…"
            value={form.improve}
            onChange={(e) => set('improve', e.target.value)}
          />
        </div>
      </div>

      <div className="form-action-row">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="generate-btn form-save-btn" disabled={!canSave}>
          Save Match
        </button>
      </div>

    </form>
  )
}
