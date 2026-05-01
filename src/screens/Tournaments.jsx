import { useState } from 'react'
import Icon from '../components/Icon'
import { useTournaments, DRAW_SIZES, ROUNDS, STATUSES } from '../data/tournamentsData'

const SURFACES = ['clay', 'hard', 'grass', 'indoor']

export default function Tournaments({ onBack }) {
  const { upcoming, past, add, remove } = useTournaments()
  const [showForm, setShowForm]       = useState(false)
  const [confirmId, setConfirmId]     = useState(null)
  const [form, setForm] = useState({
    name: '', location: '', surface: 'clay',
    startDate: '', endDate: '', drawSize: '32',
    status: 'upcoming', round: '', notes: '',
  })

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    add(form)
    setShowForm(false)
    setForm({ name: '', location: '', surface: 'clay', startDate: '', endDate: '', drawSize: '32', status: 'upcoming', round: '', notes: '' })
  }

  function handleDelete(id) {
    if (confirmId === id) { remove(id); setConfirmId(null) }
    else setConfirmId(id)
  }

  return (
    <div className="section-screen">
      <div className="section-screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="chevron-left" size={18} /></button>
        <span className="section-screen-title">Tournaments</span>
        <button className="add-match-btn" onClick={() => setShowForm(v => !v)}>
          <Icon name="plus" size={14} /> Add
        </button>
      </div>

      {showForm && (
        <form className="form-section goals-form" onSubmit={submit}>
          <div className="form-section-title">New Tournament</div>
          <div className="form-field">
            <label className="form-label">Name</label>
            <input className="text-input" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Tournament name" required />
          </div>
          <div className="form-field">
            <label className="form-label">Location</label>
            <input className="text-input" value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="City, Country" />
          </div>
          <div className="form-field">
            <label className="form-label">Surface</label>
            <div className="chip-group">
              {SURFACES.map(s => (
                <button type="button" key={s} className={`chip${form.surface === s ? ' chip--active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, surface: s }))}
                  style={{ textTransform: 'capitalize' }}>{s}</button>
              ))}
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="form-label">Start Date</label>
              <input type="date" className="text-input" value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="form-label">End Date</label>
              <input type="date" className="text-input" value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Draw Size</label>
            <div className="chip-group">
              {DRAW_SIZES.map(d => (
                <button type="button" key={d} className={`chip${form.drawSize === d ? ' chip--active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, drawSize: d }))}>{d}</button>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Status</label>
            <div className="chip-group">
              {STATUSES.map(s => (
                <button type="button" key={s} className={`chip${form.status === s ? ' chip--active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, status: s }))}
                  style={{ textTransform: 'capitalize' }}>{s}</button>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Best Round</label>
            <div className="chip-group">
              {ROUNDS.map(r => (
                <button type="button" key={r} className={`chip${form.round === r ? ' chip--active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, round: f.round === r ? '' : r }))}>{r}</button>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Notes</label>
            <textarea className="textarea" rows={2} value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes…" />
          </div>
          <div className="form-action-row">
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="generate-btn form-save-btn">Save</button>
          </div>
        </form>
      )}

      {upcoming.length > 0 && (
        <>
          <div className="section-heading">Upcoming & In Progress</div>
          <div className="tournament-list">
            {upcoming.map(t => (
              <TournamentCard key={t.id} t={t}
                onDelete={() => handleDelete(t.id)}
                confirming={confirmId === t.id}
                onCancelDelete={() => setConfirmId(null)} />
            ))}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <div className="section-heading" style={{ marginTop: 'var(--s5)' }}>Past Results</div>
          <div className="tournament-list">
            {past.map(t => (
              <TournamentCard key={t.id} t={t}
                onDelete={() => handleDelete(t.id)}
                confirming={confirmId === t.id}
                onCancelDelete={() => setConfirmId(null)} />
            ))}
          </div>
        </>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <div className="journal-empty">No tournaments yet.<br /><strong>Add a tournament</strong> to start tracking.</div>
      )}
    </div>
  )
}

function TournamentCard({ t, onDelete, confirming, onCancelDelete }) {
  return (
    <div className="tournament-card">
      <div className="tournament-card-top">
        <div className="tournament-info">
          <div className="tournament-name">{t.name}</div>
          {t.location && <div className="tournament-location">{t.location}</div>}
        </div>
        <div className="tournament-badges">
          <span className={`surface-badge surface-badge--${t.surface}`}
            style={{ textTransform: 'capitalize' }}>{t.surface}</span>
          {t.round && <span className="round-badge">{t.round}</span>}
          <span className={`tourn-status tourn-status--${t.status}`}>{t.status}</span>
        </div>
      </div>
      <div className="tournament-meta-row">
        {t.startDate && <span>{t.startDate}{t.endDate ? ` → ${t.endDate}` : ''}</span>}
        <span>Draw {t.drawSize}</span>
      </div>
      {t.notes && <div className="tournament-notes">{t.notes}</div>}
      <div className="detail-delete-area">
        {confirming ? (
          <div className="delete-confirm-row">
            <span className="delete-confirm-text">Remove this tournament?</span>
            <button className="delete-confirm-btn" onClick={onDelete}>Yes, remove</button>
            <button className="delete-cancel-btn" onClick={onCancelDelete}>Cancel</button>
          </div>
        ) : (
          <button className="delete-match-btn" onClick={onDelete}>Remove</button>
        )}
      </div>
    </div>
  )
}
