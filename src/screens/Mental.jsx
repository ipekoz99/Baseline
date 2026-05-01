import { useState, useEffect, useRef } from 'react'
import Icon from '../components/Icon'

const PHASES = [
  { label: 'Inhale',  ms: 4000 },
  { label: 'Hold',    ms: 4000 },
  { label: 'Exhale',  ms: 4000 },
  { label: 'Hold',    ms: 4000 },
]

const PROMPTS = [
  'What went well in your last match or training session?',
  'Describe one moment where you showed mental toughness recently.',
  'What is one thing you want to improve in your next session?',
  'How did you respond to a difficult situation on court?',
  'Write down three things you are grateful for as an athlete.',
  'What would your best self do differently in tomorrow\'s training?',
  'When did you last surprise yourself with your performance?',
]

const TIPS = [
  { title: 'Pre-match routine', body: 'A consistent 20-minute routine of music, dynamic warm-up, and positive self-talk primes your nervous system for competition.' },
  { title: 'Reset ritual', body: 'Between points: bounce on toes, adjust strings, take one deep breath. 20 seconds to fully reset focus.' },
  { title: 'Process over outcome', body: 'Focus on your next ball, not the scoreboard. One point at a time is the only unit of tennis that matters.' },
  { title: 'Pressure as privilege', body: 'Nerves mean you care. Reframe pressure as excitement — your body is already primed to perform.' },
]

export default function Mental({ onBack }) {
  const [breathing, setBreathing]   = useState(false)
  const [phase, setPhase]           = useState(0)
  const [progress, setProgress]     = useState(0)
  const [cycles, setCycles]         = useState(0)
  const [journalText, setJournal]   = useState('')
  const [promptIdx, setPromptIdx]   = useState(() => Math.floor(Math.random() * PROMPTS.length))
  const rafRef  = useRef(null)
  const startRef = useRef(0)

  useEffect(() => {
    if (!breathing) { cancelAnimationFrame(rafRef.current); setProgress(0); return }

    function tick() {
      const spent = Date.now() - startRef.current
      const phaseDur = PHASES[phase].ms

      if (spent >= phaseDur) {
        const next = (phase + 1) % PHASES.length
        if (next === 0) setCycles(c => c + 1)
        setPhase(next)
        setProgress(0)
        startRef.current = Date.now()
      } else {
        setProgress(spent / phaseDur)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    startRef.current = Date.now()
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [breathing, phase])

  function toggleBreath() {
    if (breathing) { setBreathing(false); setPhase(0); setCycles(0); setProgress(0) }
    else setBreathing(true)
  }

  /* Circle grows on inhale (0→1 = 1.0→1.5), holds large on hold1,
     shrinks on exhale, stays small on hold2 */
  const scale = breathing ? (
    phase === 0 ? 1.0 + 0.5 * progress :
    phase === 1 ? 1.5 :
    phase === 2 ? 1.5 - 0.5 * progress :
    1.0
  ) : 1.0

  return (
    <div className="section-screen">
      <div className="section-screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="chevron-left" size={18} /></button>
        <span className="section-screen-title">Mental</span>
      </div>

      {/* ── Box breathing ── */}
      <div className="mental-block">
        <div className="section-heading">Box Breathing · 4-4-4-4</div>
        <div className="breath-container">
          <div className="breath-ring">
            <div className="breath-circle" style={{ transform: `scale(${scale})` }}>
              <span className="breath-phase">{breathing ? PHASES[phase].label : 'Ready'}</span>
              {breathing && <span className="breath-cycles">{cycles} {cycles === 1 ? 'cycle' : 'cycles'}</span>}
            </div>
          </div>
        </div>
        <button className="generate-btn breath-toggle-btn" onClick={toggleBreath}
          style={breathing ? { background: 'var(--surface-2)', color: 'var(--text-1)', border: '1px solid var(--border)' } : {}}>
          {breathing ? 'Stop' : 'Start Breathing Exercise'}
        </button>
      </div>

      {/* ── Mental journal ── */}
      <div className="mental-block">
        <div className="section-heading">Mental Journal</div>
        <div className="journal-prompt-card">
          <div className="journal-prompt-eyebrow">Today's prompt</div>
          <div className="journal-prompt-text">{PROMPTS[promptIdx]}</div>
          <button className="journal-prompt-new"
            onClick={() => setPromptIdx(i => (i + 1) % PROMPTS.length)}>
            New prompt
          </button>
        </div>
        <textarea className="textarea" style={{ marginTop: 'var(--s3)' }} rows={5}
          value={journalText} onChange={e => setJournal(e.target.value)}
          placeholder="Write freely — no one sees this but you…" />
      </div>

      {/* ── Mental tools ── */}
      <div className="mental-block">
        <div className="section-heading">Mental Tools</div>
        <div className="mental-tips">
          {TIPS.map(t => (
            <div className="mental-tip-card" key={t.title}>
              <div className="mental-tip-title">{t.title}</div>
              <div className="mental-tip-body">{t.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
