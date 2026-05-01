import { useState } from 'react'
import Icon from '../components/Icon'
import { useRecovery, calcScore, scoreInfo, MODALITIES } from '../data/recoveryData'

const SLIDERS = [
  { key: 'sleepQuality', label: 'Sleep Quality',   lo: 'Poor',    hi: 'Great' },
  { key: 'soreness',     label: 'Muscle Soreness', lo: 'None',    hi: 'Very sore' },
  { key: 'energy',       label: 'Energy Level',    lo: 'Drained', hi: 'Energised' },
]

export default function Recovery({ onBack }) {
  const { checks, todayCheck, save } = useRecovery()
  const [form, setForm] = useState(todayCheck ?? {
    sleepHours: 7, sleepQuality: 3, soreness: 3, energy: 3, modalities: [], notes: '',
  })
  const [saved, setSaved] = useState(!!todayCheck)

  function field(key, val) { setForm(f => ({ ...f, [key]: val })); setSaved(false) }

  function toggleModality(m) {
    setForm(f => ({
      ...f,
      modalities: f.modalities.includes(m) ? f.modalities.filter(x => x !== m) : [...f.modalities, m],
    }))
    setSaved(false)
  }

  function handleSave() { save(form); setSaved(true) }

  const score = calcScore(form)
  const info  = scoreInfo(score)

  return (
    <div className="section-screen">
      <div className="section-screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="chevron-left" size={18} /></button>
        <span className="section-screen-title">Recovery</span>
      </div>

      {/* Score ring */}
      <div className="recovery-score-card" style={{ '--score-color': info.color }}>
        <div className="recovery-score-num" style={{ color: info.color }}>{score}</div>
        <div className="recovery-score-label" style={{ color: info.color }}>{info.label}</div>
        <div className="recovery-score-sub">Today's recovery score</div>
      </div>

      {/* Check-in form */}
      <div className="form-section goals-form">
        <div className="form-section-title">Today's Check-in</div>

        <div className="form-field">
          <label className="form-label">Sleep Hours</label>
          <div className="recovery-number-row">
            <button className="recovery-adj-btn" type="button"
              onClick={() => field('sleepHours', Math.max(0, form.sleepHours - 0.5))}>−</button>
            <span className="recovery-number">{form.sleepHours}h</span>
            <button className="recovery-adj-btn" type="button"
              onClick={() => field('sleepHours', Math.min(12, form.sleepHours + 0.5))}>+</button>
          </div>
        </div>

        {SLIDERS.map(({ key, label, lo, hi }) => (
          <div className="form-field" key={key}>
            <div className="pain-labels-row">
              <label className="form-label">{label}</label>
              <span className="pain-value-label">{form[key]}/5</span>
            </div>
            <div className="chip-group">
              {[1, 2, 3, 4, 5].map(v => (
                <button type="button" key={v}
                  className={`chip${form[key] === v ? ' chip--active' : ''}`}
                  style={{ minWidth: 40 }}
                  onClick={() => field(key, v)}>{v}</button>
              ))}
            </div>
            <div className="fatigue-scale-labels"><span>{lo}</span><span>{hi}</span></div>
          </div>
        ))}

        <div className="form-field">
          <label className="form-label">Recovery Modalities</label>
          <div className="chip-group">
            {MODALITIES.map(m => (
              <button type="button" key={m}
                className={`chip${form.modalities.includes(m) ? ' chip--active' : ''}`}
                onClick={() => toggleModality(m)}>{m}</button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Notes</label>
          <textarea className="textarea" rows={2} value={form.notes}
            onChange={e => { setForm(f => ({ ...f, notes: e.target.value })); setSaved(false) }}
            placeholder="How are you feeling today?" />
        </div>

        <button type="button" className="generate-btn" onClick={handleSave}
          style={{ opacity: saved ? 0.6 : 1 }}>
          {saved ? 'Saved ✓' : 'Save Check-in'}
        </button>
      </div>

      {/* History */}
      {checks.length > 0 && (
        <>
          <div className="section-heading">History</div>
          <div className="recovery-history">
            {checks.map(c => {
              const s   = calcScore(c)
              const inf = scoreInfo(s)
              return (
                <div className="recovery-history-item" key={c.id}>
                  <div className="recovery-hist-left">
                    <span className="recovery-hist-date">{c.date}</span>
                    <span className="recovery-hist-info">
                      {c.sleepHours}h · Soreness {c.soreness}/5 · Energy {c.energy}/5
                    </span>
                  </div>
                  <div className="recovery-hist-score" style={{ color: inf.color }}>
                    {s}
                    <span className="recovery-hist-label"> {inf.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
