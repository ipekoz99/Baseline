import { useState } from 'react'

// ─── Primitive components ──────────────────────────────────────────────────

function ChipGroup({ options, value, onChange }) {
  return (
    <div className="chip-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`chip${value === opt.value ? ' chip--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function FatigueSelector({ value, onChange }) {
  const labels = ['', 'Fresh', 'Good', 'Moderate', 'Tired', 'Exhausted']
  return (
    <div className="fatigue-selector">
      <div className="fatigue-row">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            data-level={n}
            className={`fatigue-btn${value === n ? ' fatigue-btn--active' : ''}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="fatigue-scale-labels">
        <span>Fresh</span>
        <span>Exhausted</span>
      </div>
      {value != null && (
        <p className="fatigue-desc">{labels[value]}</p>
      )}
    </div>
  )
}

function YesNo({ value, onChange }) {
  return (
    <div className="yn-row">
      <button
        type="button"
        className={`yn-btn${value === false ? ' yn-btn--active' : ''}`}
        onClick={() => onChange(false)}
      >
        No
      </button>
      <button
        type="button"
        className={`yn-btn${value === true ? ' yn-btn--active' : ''}`}
        onClick={() => onChange(true)}
      >
        Yes
      </button>
    </div>
  )
}

// ─── Option sets ───────────────────────────────────────────────────────────

const LEVELS    = [{ value: 'u12', label: 'U12' }, { value: 'u14', label: 'U14' }, { value: 'itf', label: 'ITF Junior' }, { value: 'pro', label: 'Pro' }]
const SURFACES  = [{ value: 'clay', label: 'Clay' }, { value: 'hard', label: 'Hard' }, { value: 'grass', label: 'Grass' }, { value: 'indoor', label: 'Indoor' }]
const DURATIONS = [{ value: '2', label: '2 h' }, { value: '2.5', label: '2.5 h' }, { value: '3', label: '3 h' }]
const PARTNERS  = [{ value: 'coach', label: 'Coach' }, { value: 'partner', label: 'Partner' }, { value: 'solo', label: 'Solo' }]
const HOURS_AGO = [
  { value: '6',  label: '6 h' },
  { value: '12', label: '12 h' },
  { value: '18', label: '18 h' },
  { value: '24', label: '24 h' },
  { value: '36', label: '36 h' },
  { value: '48', label: '48 h+' },
]

// ─── Form ──────────────────────────────────────────────────────────────────

const EMPTY = {
  level: '', surface: '', duration: '', partner: '',
  fatigue: null, hoursSinceLast: '',
  hasTraveled: false, travelHours: '', travelCity: '',
  tournamentDays: '',
  hasInjury: false, injuryLocation: '', injuryPain: 5,
  coachNote: '',
}

export default function DailyForm({ onGenerate }) {
  const [form, setForm] = useState(EMPTY)

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const canGenerate =
    form.level && form.surface && form.duration &&
    form.partner && form.fatigue != null && form.hoursSinceLast

  function handleSubmit(e) {
    e.preventDefault()
    if (canGenerate) onGenerate(form)
  }

  return (
    <form className="daily-form" onSubmit={handleSubmit}>

      {/* ── Session Setup ──────────────────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">Session Setup</p>

        <div className="form-field">
          <label className="form-label">Player Level</label>
          <ChipGroup options={LEVELS} value={form.level} onChange={(v) => set('level', v)} />
        </div>

        <div className="form-field">
          <label className="form-label">Court Surface</label>
          <ChipGroup options={SURFACES} value={form.surface} onChange={(v) => set('surface', v)} />
        </div>

        <div className="form-field">
          <label className="form-label">Tennis Duration</label>
          <ChipGroup options={DURATIONS} value={form.duration} onChange={(v) => set('duration', v)} />
        </div>

        <div className="form-field">
          <label className="form-label">Training Partner</label>
          <ChipGroup options={PARTNERS} value={form.partner} onChange={(v) => set('partner', v)} />
        </div>
      </div>

      {/* ── Today's Status ─────────────────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">Today's Status</p>

        <div className="form-field">
          <label className="form-label">Fatigue Level</label>
          <FatigueSelector value={form.fatigue} onChange={(v) => set('fatigue', v)} />
        </div>

        <div className="form-field">
          <label className="form-label">Hours Since Last Training</label>
          <ChipGroup options={HOURS_AGO} value={form.hoursSinceLast} onChange={(v) => set('hoursSinceLast', v)} />
        </div>

        <div className="form-field">
          <label className="form-label">Travel Today?</label>
          <YesNo value={form.hasTraveled} onChange={(v) => set('hasTraveled', v)} />
          {form.hasTraveled && (
            <div className="sub-fields">
              <div className="form-row-2">
                <div>
                  <label className="form-label-sm">Hours travelled</label>
                  <input
                    type="number"
                    className="text-input"
                    placeholder="e.g. 3"
                    min="0" max="24"
                    value={form.travelHours}
                    onChange={(e) => set('travelHours', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label-sm">City / destination</label>
                  <input
                    type="text"
                    className="text-input"
                    placeholder="e.g. Madrid"
                    value={form.travelCity}
                    onChange={(e) => set('travelCity', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Tournament ─────────────────────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">Tournament</p>
        <div className="form-field">
          <label className="form-label">Days to Next Match</label>
          <input
            type="number"
            className="text-input days-input"
            placeholder="Leave blank if no upcoming match"
            min="0"
            value={form.tournamentDays}
            onChange={(e) => set('tournamentDays', e.target.value)}
          />
          <p className="form-hint">0 = match today &nbsp;·&nbsp; blank = no upcoming match</p>
        </div>
      </div>

      {/* ── Injury ─────────────────────────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">Injury / Pain</p>
        <div className="form-field">
          <label className="form-label">Any injury or pain today?</label>
          <YesNo value={form.hasInjury} onChange={(v) => set('hasInjury', v)} />
          {form.hasInjury && (
            <div className="sub-fields">
              <div>
                <label className="form-label-sm">Location</label>
                <input
                  type="text"
                  className="text-input"
                  placeholder="e.g. left knee, right shoulder"
                  value={form.injuryLocation}
                  onChange={(e) => set('injuryLocation', e.target.value)}
                />
              </div>
              <div className="pain-slider-field">
                <div className="pain-labels-row">
                  <label className="form-label-sm">Pain Level</label>
                  <span className="pain-value-label">{form.injuryPain} / 10</span>
                </div>
                <input
                  type="range"
                  className="pain-slider"
                  min="1" max="10"
                  value={form.injuryPain}
                  style={{ '--pct': `${(form.injuryPain - 1) / 9 * 100}%` }}
                  onChange={(e) => set('injuryPain', Number(e.target.value))}
                />
                <div className="pain-range-labels">
                  <span>Mild</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Coach Note ─────────────────────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">Coach Note</p>
        <div className="form-field">
          <textarea
            className="textarea"
            rows={3}
            placeholder="Any specific focus or instructions from your coach…"
            value={form.coachNote}
            onChange={(e) => set('coachNote', e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="generate-btn" disabled={!canGenerate}>
        Generate Training Plan
      </button>

    </form>
  )
}
