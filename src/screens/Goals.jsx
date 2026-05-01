import { useState } from 'react'
import Icon from '../components/Icon'
import { useGoals, CATEGORIES } from '../data/goalsData'

export default function Goals({ onBack }) {
  const { goals, add, setProgress, toggle, remove } = useGoals()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Technical', targetDate: '', progress: 0, notes: '' })

  const active = goals.filter(g => !g.completed)
  const done   = goals.filter(g =>  g.completed)

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    add(form)
    setShowForm(false)
    setForm({ title: '', category: 'Technical', targetDate: '', progress: 0, notes: '' })
  }

  return (
    <div className="section-screen">
      <div className="section-screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="chevron-left" size={18} /></button>
        <span className="section-screen-title">Goals</span>
        <button className="add-match-btn" onClick={() => setShowForm(v => !v)}>
          <Icon name="plus" size={14} /> Add
        </button>
      </div>

      {showForm && (
        <form className="form-section goals-form" onSubmit={submit}>
          <div className="form-section-title">New Goal</div>
          <div className="form-field">
            <label className="form-label">Goal</label>
            <input className="text-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Improve kick serve consistency" required />
          </div>
          <div className="form-field">
            <label className="form-label">Category</label>
            <div className="chip-group">
              {CATEGORIES.map(c => (
                <button type="button" key={c} className={`chip${form.category === c ? ' chip--active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, category: c }))}>{c}</button>
              ))}
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="form-label">Target Date</label>
              <input type="date" className="text-input" value={form.targetDate}
                onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="form-label">Initial %</label>
              <input type="number" className="text-input" min={0} max={100} value={form.progress}
                onChange={e => setForm(f => ({ ...f, progress: +e.target.value }))} />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Notes</label>
            <textarea className="textarea" rows={2} value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes…" />
          </div>
          <div className="form-action-row">
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="generate-btn form-save-btn">Save Goal</button>
          </div>
        </form>
      )}

      {active.length > 0 && (
        <div className="goals-group">
          <div className="section-heading">Active · {active.length}</div>
          <div className="goals-list">
            {active.map(g => (
              <GoalCard key={g.id} goal={g}
                onToggle={() => toggle(g.id)}
                onDelete={() => remove(g.id)}
                onProgress={v => setProgress(g.id, v)} />
            ))}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div className="goals-group">
          <div className="section-heading">Completed · {done.length}</div>
          <div className="goals-list">
            {done.map(g => (
              <GoalCard key={g.id} goal={g}
                onToggle={() => toggle(g.id)}
                onDelete={() => remove(g.id)}
                onProgress={v => setProgress(g.id, v)} />
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="journal-empty">No goals yet.<br /><strong>Add your first goal</strong> to start tracking.</div>
      )}
    </div>
  )
}

const CAT_COLOR = { Technical: '#7850dc', Physical: '#3880dc', Mental: '#dc6430', Competition: 'var(--accent)' }

function GoalCard({ goal, onToggle, onDelete, onProgress }) {
  return (
    <div className={`goal-card${goal.completed ? ' goal-card--done' : ''}`}>
      <div className="goal-card-header">
        <button className="goal-check-btn" onClick={onToggle} aria-label="Toggle complete">
          <Icon name={goal.completed ? 'check-circle' : 'target'} size={18} />
        </button>
        <div className="goal-card-body">
          <span className="goal-title">{goal.title}</span>
          <span className="goal-category-badge"
            style={{ background: `${CAT_COLOR[goal.category]}22`, color: CAT_COLOR[goal.category] }}>
            {goal.category}
          </span>
        </div>
        <button className="goal-delete-btn" onClick={onDelete} aria-label="Delete goal">
          <Icon name="trash-2" size={15} />
        </button>
      </div>

      <div className="goal-progress-area">
        <div className="goal-progress-row">
          <span className="goal-progress-pct">{goal.progress}%</span>
          {goal.targetDate && <span className="goal-date">Due {goal.targetDate}</span>}
        </div>
        <div className="goal-bar-track">
          <div className="goal-bar-fill" style={{ width: `${goal.progress}%` }} />
        </div>
        {!goal.completed && (
          <input type="range" min={0} max={100} value={goal.progress} className="goal-slider"
            onChange={e => onProgress(+e.target.value)} aria-label="Progress" />
        )}
      </div>

      {goal.notes && <div className="goal-notes">{goal.notes}</div>}
    </div>
  )
}
