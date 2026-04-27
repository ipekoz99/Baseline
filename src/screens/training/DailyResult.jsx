// ─── Phase icons (inline SVG paths) ───────────────────────────────────────
const PHASE_ICONS = {
  warmup: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  tennis: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M5.6 5.6c2.4 2.4 2.4 6 0 8.4M18.4 18.4c-2.4-2.4-2.4-6 0-8.4" />
    </svg>
  ),
  cooldown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
}

// ─── Single phase block ────────────────────────────────────────────────────
function PlanBlock({ block }) {
  return (
    <div className="plan-block">
      <div className="block-header">
        <span className="block-name">{block.name}</span>
        <span className="block-dur">{block.duration}</span>
      </div>
      <ul className="block-items">
        {block.items.map((item, i) => (
          <li key={i} className="block-item">{item}</li>
        ))}
      </ul>
    </div>
  )
}

// ─── Phase section (warmup / tennis / cooldown) ────────────────────────────
function Phase({ phase, icon, label, phaseKey }) {
  return (
    <div className={`plan-phase plan-phase--${phaseKey}`}>
      <div className="phase-header">
        <div className="phase-header-left">
          <span className="phase-icon">{icon}</span>
          <span className="phase-title">{label}</span>
        </div>
        <span className="phase-duration">{phase.duration}</span>
      </div>
      <div className="phase-blocks">
        {phase.blocks.map((block, i) => (
          <PlanBlock key={i} block={block} />
        ))}
      </div>
    </div>
  )
}

// ─── Result ────────────────────────────────────────────────────────────────
export default function DailyResult({ plan, onReset }) {
  return (
    <div className="plan-result">

      {/* Header */}
      <div className="plan-result-header">
        <div className="plan-result-title-row">
          <h2 className="plan-result-title">Today's Plan</h2>
          <button type="button" className="new-plan-btn" onClick={onReset}>
            ← New plan
          </button>
        </div>
        <div className="plan-badges">
          <span className={`intensity-badge intensity-badge--${plan.intensity}`}>
            {plan.intensityLabel}
          </span>
          <span className="focus-badge">{plan.focusLabel}</span>
        </div>
      </div>

      {/* Phases */}
      <Phase
        phaseKey="warmup"
        phase={plan.warmup}
        icon={PHASE_ICONS.warmup}
        label="Warmup"
      />
      <Phase
        phaseKey="tennis"
        phase={plan.tennisSession}
        icon={PHASE_ICONS.tennis}
        label="Tennis Session"
      />
      <Phase
        phaseKey="cooldown"
        phase={plan.cooldown}
        icon={PHASE_ICONS.cooldown}
        label="Cooldown"
      />

    </div>
  )
}
