import { useState } from 'react'
import Icon from '../components/Icon'

const PROGRAMS = [
  {
    id: 'strength',
    name: 'Strength & Power',
    duration: '45 min',
    level: 'Intermediate',
    exercises: [
      { name: 'Barbell Squat',           sets: 4, reps: '6',       rest: '120s' },
      { name: 'Romanian Deadlift',        sets: 3, reps: '8',       rest: '90s'  },
      { name: 'Single-Leg Press',         sets: 3, reps: '10 each', rest: '60s'  },
      { name: 'Med Ball Rotational Throw',sets: 4, reps: '6 each',  rest: '60s'  },
      { name: 'Nordic Hamstring Curl',    sets: 3, reps: '5',       rest: '90s'  },
      { name: 'Standing Calf Raise',      sets: 3, reps: '15',      rest: '45s'  },
    ],
  },
  {
    id: 'speed',
    name: 'Speed & Agility',
    duration: '35 min',
    level: 'All levels',
    exercises: [
      { name: 'Lateral Shuffle 5 m',    sets: 6, reps: '10s',    rest: '40s' },
      { name: 'Spider Drill',            sets: 5, reps: '1 run',  rest: '45s' },
      { name: 'Split Step Reaction',     sets: 4, reps: '8',      rest: '30s' },
      { name: 'Crossover Step Drill',    sets: 4, reps: '8 each', rest: '40s' },
      { name: 'Cone T-Drill',            sets: 4, reps: '1 run',  rest: '50s' },
    ],
  },
  {
    id: 'endurance',
    name: 'On-Court Endurance',
    duration: '30 min',
    level: 'All levels',
    exercises: [
      { name: 'Baseline Sprints',        sets: 8, reps: '1 length', rest: '15s' },
      { name: 'Side-to-Side Rally Run',  sets: 3, reps: '2 min',    rest: '60s' },
      { name: 'Suicide Sprints',         sets: 4, reps: '1 run',    rest: '45s' },
      { name: 'Footwork Shadow',         sets: 3, reps: '90s',      rest: '30s' },
    ],
  },
  {
    id: 'mobility',
    name: 'Mobility & Flexibility',
    duration: '25 min',
    level: 'All levels',
    exercises: [
      { name: 'Hip 90/90 Stretch',     sets: 2, reps: '60s each', rest: '15s' },
      { name: 'Thoracic Rotation',     sets: 2, reps: '10 each',  rest: '15s' },
      { name: 'Cossack Squat',         sets: 2, reps: '8 each',   rest: '20s' },
      { name: 'Shoulder Band Stretch', sets: 2, reps: '45s each', rest: '15s' },
      { name: 'Pigeon Pose',           sets: 2, reps: '60s each', rest: '10s' },
      { name: 'Cat-Cow',               sets: 2, reps: '10',       rest: '10s' },
    ],
  },
]

export default function Conditioning({ onBack }) {
  const [activeId, setActiveId]   = useState(null)
  const [completed, setCompleted] = useState({})

  function toggleEx(progId, idx) {
    const k = `${progId}-${idx}`
    setCompleted(c => ({ ...c, [k]: !c[k] }))
  }

  if (activeId) {
    const prog = PROGRAMS.find(p => p.id === activeId)
    const done = prog.exercises.filter((_, i) => completed[`${prog.id}-${i}`]).length
    const pct  = Math.round((done / prog.exercises.length) * 100)

    return (
      <div className="section-screen">
        <div className="section-screen-header">
          <button className="back-btn" onClick={() => setActiveId(null)}><Icon name="chevron-left" size={18} /></button>
          <span className="section-screen-title">{prog.name}</span>
        </div>

        <div className="cond-prog-meta">
          <span className="cond-badge">{prog.duration}</span>
          <span className="cond-badge">{prog.level}</span>
          <span className="cond-done-text">{done}/{prog.exercises.length} done</span>
        </div>

        {pct > 0 && (
          <div className="goal-bar-track" style={{ marginBottom: 'var(--s4)' }}>
            <div className="goal-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        )}

        <div className="cond-exercise-list">
          {prog.exercises.map((ex, i) => {
            const k     = `${prog.id}-${i}`
            const isDone = !!completed[k]
            return (
              <button key={i} className={`cond-exercise-item${isDone ? ' cond-exercise-item--done' : ''}`}
                onClick={() => toggleEx(prog.id, i)}>
                <div className="cond-ex-check">
                  {isDone
                    ? <Icon name="check-circle" size={20} />
                    : <div className="cond-ex-circle" />}
                </div>
                <div className="cond-ex-body">
                  <span className="cond-ex-name">{ex.name}</span>
                  <span className="cond-ex-meta">{ex.sets} × {ex.reps} · Rest {ex.rest}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="section-screen">
      <div className="section-screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="chevron-left" size={18} /></button>
        <span className="section-screen-title">Conditioning</span>
      </div>

      <div className="section-heading">Programs</div>
      <div className="cond-programs">
        {PROGRAMS.map(p => {
          const done = p.exercises.filter((_, i) => completed[`${p.id}-${i}`]).length
          const pct  = Math.round((done / p.exercises.length) * 100)
          return (
            <button key={p.id} className="cond-program-card" onClick={() => setActiveId(p.id)}>
              <div className="cond-prog-header">
                <span className="cond-prog-name">{p.name}</span>
                <span className="cond-badge">{p.duration}</span>
              </div>
              <div className="cond-prog-sub">{p.level} · {p.exercises.length} exercises</div>
              {pct > 0 && (
                <div className="goal-bar-track" style={{ marginTop: 'var(--s2)' }}>
                  <div className="goal-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
