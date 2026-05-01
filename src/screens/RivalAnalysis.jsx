import { useState } from 'react'
import Icon from '../components/Icon'
import { useRivals, STYLES } from '../data/rivalData'

const SURFACES = ['Clay', 'Hard', 'Grass', 'Indoor']

export default function RivalAnalysis({ onBack }) {
  const { rivals, add, remove } = useRivals()
  const [selected, setSelected]   = useState(null)
  const [showForm, setShowForm]   = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [form, setForm] = useState({
    name: '', nationality: '', ranking: '',
    surface: 'Hard', style: 'Baseline Grinder',
    strengths: [''], weaknesses: [''], notes: '',
  })

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    add({
      ...form,
      ranking:    +form.ranking || 0,
      strengths:  form.strengths.filter(Boolean),
      weaknesses: form.weaknesses.filter(Boolean),
    })
    setShowForm(false)
    setForm({ name: '', nationality: '', ranking: '', surface: 'Hard', style: 'Baseline Grinder', strengths: [''], weaknesses: [''], notes: '' })
  }

  function addItem(field)        { setForm(f => ({ ...f, [field]: [...f[field], ''] })) }
  function updateItem(field, i, v) { setForm(f => ({ ...f, [field]: f[field].map((x, j) => j === i ? v : x) })) }

  /* ── Detail view ── */
  if (selected !== null) {
    const rival = rivals.find(r => r.id === selected)
    if (!rival) { setSelected(null); return null }
    return (
      <div className="section-screen">
        <div className="section-screen-header">
          <button className="back-btn" onClick={() => { setSelected(null); setConfirmId(null) }}>
            <Icon name="chevron-left" size={18} />
          </button>
          <span className="section-screen-title">{rival.name}</span>
        </div>

        <div className="rival-detail-hero">
          <div className="rival-hero-left">
            {rival.nationality && <span className="rival-nat-badge">{rival.nationality}</span>}
            {rival.ranking > 0 && <span className="rival-ranking-badge">#{rival.ranking}</span>}
            <span className={`surface-badge surface-badge--${rival.surface?.toLowerCase()}`}>{rival.surface}</span>
            <span className="rival-style-badge">{rival.style}</span>
          </div>
          <div className="rival-h2h-display">
            <span className="rival-h2h-w">{rival.h2w}W</span>
            <span className="rival-h2h-sep"> – </span>
            <span className="rival-h2h-l">{rival.h2l}L</span>
          </div>
        </div>

        {rival.strengths?.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-label">Strengths</div>
            <div className="rival-tag-list">
              {rival.strengths.map((s, i) => <span key={i} className="rival-tag rival-tag--strength">{s}</span>)}
            </div>
          </div>
        )}

        {rival.weaknesses?.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-label">Weaknesses</div>
            <div className="rival-tag-list">
              {rival.weaknesses.map((w, i) => <span key={i} className="rival-tag rival-tag--weakness">{w}</span>)}
            </div>
          </div>
        )}

        {rival.notes && (
          <div className="detail-section">
            <div className="detail-section-label">Tactical Notes</div>
            <div className="detail-notes-text">{rival.notes}</div>
          </div>
        )}

        <div className="detail-delete-area">
          {confirmId === rival.id ? (
            <div className="delete-confirm-row">
              <span className="delete-confirm-text">Remove this rival?</span>
              <button className="delete-confirm-btn" onClick={() => { remove(rival.id); setSelected(null); setConfirmId(null) }}>Yes, remove</button>
              <button className="delete-cancel-btn" onClick={() => setConfirmId(null)}>Cancel</button>
            </div>
          ) : (
            <button className="delete-match-btn" onClick={() => setConfirmId(rival.id)}>Remove rival</button>
          )}
        </div>
      </div>
    )
  }

  /* ── List view ── */
  return (
    <div className="section-screen">
      <div className="section-screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="chevron-left" size={18} /></button>
        <span className="section-screen-title">Rival Analysis</span>
        <button className="add-match-btn" onClick={() => setShowForm(v => !v)}>
          <Icon name="plus" size={14} /> Add
        </button>
      </div>

      {showForm && (
        <form className="form-section goals-form" onSubmit={submit}>
          <div className="form-section-title">Add Rival</div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="form-label">Name</label>
              <input className="text-input" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. J. Doe" required />
            </div>
            <div className="form-field">
              <label className="form-label">Nationality</label>
              <input className="text-input" value={form.nationality}
                onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
                placeholder="e.g. GER" maxLength={3} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="form-label">Ranking</label>
              <input type="number" className="text-input" value={form.ranking}
                onChange={e => setForm(f => ({ ...f, ranking: e.target.value }))}
                placeholder="#" min={1} />
            </div>
            <div className="form-field">
              <label className="form-label">Surface</label>
              <div className="chip-group">
                {SURFACES.map(s => (
                  <button type="button" key={s} className={`chip${form.surface === s ? ' chip--active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, surface: s }))}>{s}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Playing Style</label>
            <div className="chip-group">
              {STYLES.map(s => (
                <button type="button" key={s} className={`chip${form.style === s ? ' chip--active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, style: s }))}>{s}</button>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Strengths</label>
            {form.strengths.map((s, i) => (
              <input key={i} className="text-input" style={{ marginBottom: 4 }} value={s}
                onChange={e => updateItem('strengths', i, e.target.value)}
                placeholder={`Strength ${i + 1}`} />
            ))}
            <button type="button" className="cancel-btn" style={{ padding: '6px 12px', fontSize: 12 }}
              onClick={() => addItem('strengths')}>+ Add strength</button>
          </div>
          <div className="form-field">
            <label className="form-label">Weaknesses</label>
            {form.weaknesses.map((w, i) => (
              <input key={i} className="text-input" style={{ marginBottom: 4 }} value={w}
                onChange={e => updateItem('weaknesses', i, e.target.value)}
                placeholder={`Weakness ${i + 1}`} />
            ))}
            <button type="button" className="cancel-btn" style={{ padding: '6px 12px', fontSize: 12 }}
              onClick={() => addItem('weaknesses')}>+ Add weakness</button>
          </div>
          <div className="form-field">
            <label className="form-label">Tactical Notes</label>
            <textarea className="textarea" rows={3} value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Key tactical observations…" />
          </div>
          <div className="form-action-row">
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="generate-btn form-save-btn">Save Rival</button>
          </div>
        </form>
      )}

      <div className="rivals-list">
        {rivals.map(r => (
          <button key={r.id} className="rival-card" onClick={() => setSelected(r.id)}>
            <div className="rival-card-inner">
              <div className="rival-card-name">{r.name}</div>
              <div className="rival-card-meta">
                {r.nationality && <span className="rival-nat-badge">{r.nationality}</span>}
                {r.ranking > 0 && <span>#{r.ranking}</span>}
                <span className={`surface-badge surface-badge--${r.surface?.toLowerCase()}`}>{r.surface}</span>
                <span className="rival-style-chip">{r.style}</span>
              </div>
            </div>
            <div className="rival-card-h2h">
              <span className="rival-h2h-w">{r.h2w}W</span>
              <span className="rival-h2h-sep"> – </span>
              <span className="rival-h2h-l">{r.h2l}L</span>
            </div>
            <Icon name="chevron-right" size={16} />
          </button>
        ))}
      </div>

      {rivals.length === 0 && (
        <div className="journal-empty">No rivals yet.<br /><strong>Add a rival</strong> to start scouting.</div>
      )}
    </div>
  )
}
