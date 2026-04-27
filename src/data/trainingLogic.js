// ─────────────────────────────────────────────────────────────────────────────
// INTENSITY  (score-based: higher score → lower intensity)
// ─────────────────────────────────────────────────────────────────────────────
export function calcIntensity(f) {
  let s = 0

  // Fatigue (dominant factor, 1 = fresh → 5 = exhausted)
  s += [0, 0, 12, 26, 42, 58][f.fatigue] ?? 0

  // Recovery time since last session
  const h = parseFloat(f.hoursSinceLast) || 24
  if (h < 8)       s += 30
  else if (h < 14) s += 15
  else if (h < 20) s += 5

  // Tournament proximity
  if (f.tournamentDays !== '' && f.tournamentDays != null) {
    const td = parseInt(f.tournamentDays, 10)
    if (td === 0)     s += 60   // match day → always activation
    else if (td === 1) s += 40
    else if (td <= 3)  s += 22
    else if (td <= 7)  s += 8
  }

  // Injury load
  if (f.hasInjury) {
    const p = parseInt(f.injuryPain, 10) || 5
    if (p >= 8)      s += 40
    else if (p >= 6) s += 25
    else if (p >= 4) s += 12
    else             s += 5
  }

  // Travel fatigue
  if (f.hasTraveled) {
    const th = parseFloat(f.travelHours) || 2
    if (th >= 6)      s += 28
    else if (th >= 3) s += 15
    else              s += 6
  }

  if (s >= 75) return 'activation'
  if (s >= 48) return 'light'
  if (s >= 24) return 'medium'
  return 'heavy'
}

// ─────────────────────────────────────────────────────────────────────────────
// FOCUS
// ─────────────────────────────────────────────────────────────────────────────
export function calcFocus(f, intensity) {
  if (intensity === 'activation') return 'recovery'

  if (f.tournamentDays !== '' && f.tournamentDays != null) {
    const td = parseInt(f.tournamentDays, 10)
    if (td <= 4) return 'tactical'
  }

  if (f.partner === 'solo')                              return 'technical'
  if (intensity === 'heavy' && f.partner === 'partner') return 'endurance'
  return 'technical'
}

// ─────────────────────────────────────────────────────────────────────────────
// WARMUP
// ─────────────────────────────────────────────────────────────────────────────
function buildWarmup(f, intensity) {
  const surfaceFoam = {
    clay:   ['Quads · 60s each side', 'Hamstrings · 60s each', 'IT Band · 45s each', 'Thoracic spine · 90s'],
    hard:   ['Calves · 60s each', 'Achilles / Soleus · 60s each', 'Hip flexors · 60s each', 'Thoracic spine · 90s'],
    grass:  ['Adductors · 60s each', 'Calves · 60s each', 'Glutes / Piriformis · 60s each', 'Thoracic spine · 90s'],
    indoor: ['Hip flexors · 60s each', 'Quads · 60s each', 'Upper back · 90s', 'Thoracic spine · 90s'],
  }
  const foamItems = [...(surfaceFoam[f.surface] ?? surfaceFoam.hard)]
  if (f.hasInjury && f.injuryLocation && parseInt(f.injuryPain, 10) <= 5) {
    foamItems.push(`${f.injuryLocation} area · gentle 40s — skip if sharp pain`)
  }

  const ground = {
    heavy: [
      'Hip 90/90 · 8 reps per side',
      "World's Greatest Stretch · 5 reps per side",
      'Lunge matrix — forward / lateral / rotational · 5 each',
      'Thoracic rotation (seated) · 10 each side',
      'Ankle circles · 10 each direction',
    ],
    medium: [
      'Hip circles · 10 each direction',
      'Cat-cow · 10 slow reps',
      'Lunge with thoracic rotation · 6 each side',
      'Lateral leg swings · 10 each',
    ],
    light: [
      'Gentle hip circles · 8 each side',
      'Seated piriformis stretch · 30s each',
      'Easy cat-cow · 8 reps',
      'Arm circles forward and back · 10 each',
    ],
    activation: [
      'Gentle hip rolls · 6 each side',
      'Easy shoulder circles · 8 each',
      'Ankle rolls · 10 each side',
    ],
  }

  const courtRuns = {
    heavy: [
      '4× full-court side shuffle',
      '3× cross-step (full court)',
      '4× sprint + hard decelerate',
      '2× full-court sprint',
      '2× backward run to baseline',
    ],
    medium: [
      '3× full-court side shuffle',
      '2× cross-step (full court)',
      '3× sprint + controlled stop',
      '1× full-court sprint',
    ],
    light: [
      '2× half-court side shuffle',
      '2× easy jog full court',
      '1× light sprint at 60% effort',
    ],
    activation: [
      '2× gentle jog baseline-to-net',
      '1× easy walk + arm swings full court',
    ],
  }

  const bands = {
    heavy: [
      'External rotation · 3×15 each arm',
      'Hip abduction standing · 3×20 each side',
      'Monster walks forward and back · 2×20 steps',
      'Shoulder press · 2×12',
    ],
    medium: [
      'External rotation · 2×15 each arm',
      'Hip abduction standing · 2×20 each side',
      'Shoulder retraction · 2×15',
    ],
    light: [
      'External rotation · 1×12 each arm · light band',
      'Hip abduction · 1×15 each side',
    ],
    activation: [
      'External rotation · 1×10 each arm · very light',
    ],
  }

  const totalDur = { heavy: '22–28 min', medium: '18–22 min', light: '14–18 min', activation: '10–12 min' }
  const blockDur = {
    heavy:      { foam: '8 min', ground: '8 min', runs: '7 min', bands: '6 min' },
    medium:     { foam: '7 min', ground: '6 min', runs: '5 min', bands: '4 min' },
    light:      { foam: '6 min', ground: '4 min', runs: '3 min', bands: '3 min' },
    activation: { foam: '4 min', ground: '3 min', runs: '2 min', bands: '2 min' },
  }
  const d = blockDur[intensity]

  return {
    duration: totalDur[intensity],
    blocks: [
      { name: 'Foam Roller',      duration: d.foam,   items: foamItems },
      { name: 'Ground Movements', duration: d.ground, items: ground[intensity] },
      { name: 'Court Runs',       duration: d.runs,   items: courtRuns[intensity] },
      { name: 'Resistance Bands', duration: d.bands,  items: bands[intensity] },
    ],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TENNIS SESSION
// ─────────────────────────────────────────────────────────────────────────────
function buildTennisSession(f, intensity, focus) {
  const dur = parseFloat(f.duration) || 2
  const durLabel = dur === 2 ? '2 h' : dur === 2.5 ? '2 h 30 min' : '3 h'
  const ext = dur === 2 ? 0 : dur === 2.5 ? 30 : 60  // extra minutes beyond 2h
  const x = (base, share) => `${base + Math.round(ext * share)} min`

  const solo    = f.partner === 'solo'
  const surface = f.surface || 'hard'
  const isClay  = surface === 'clay'

  const warmBlock = (extra = 0) => ({
    name: 'On-Court Warm-Up',
    duration: `${15 + extra} min`,
    items: [
      'Mini-tennis — build touch and rhythm · 5 min',
      'Service line rallies — controlled depth · 5 min',
      'Full-court rallies — neutral pace · 5 min',
    ],
  })

  const sessions = {
    'heavy-endurance': {
      blocks: [
        warmBlock(),
        {
          name: 'Baseline Endurance Rally',
          duration: x(25, 0.35),
          items: [
            'Crosscourt FH rally — 25-ball targets · 8 min',
            'Crosscourt BH rally — 25-ball targets · 8 min',
            'Alternating FH/BH crosscourt · 6 min',
            'Running down-the-line BH · 5 min',
          ],
        },
        {
          name: 'Loaded Point-Ending Drills',
          duration: x(20, 0.25),
          items: [
            'Inside-out FH attack from mid-court · 15 reps',
            'Approach + close to net + volley out · 15 reps',
            'Wide ball defensive recovery + reset · 12 reps each side',
          ],
        },
        {
          name: 'Live Ball + Fitness',
          duration: x(25, 0.3),
          items: [
            'Serve + 1 live play · 15 min',
            solo ? 'Shadow footwork — split-step and recover · 10 min' : 'King of the court (rotate on errors) · 10 min',
          ],
        },
        ...(dur >= 2.5 ? [{
          name: 'Conditioning Circuit',
          duration: '15 min',
          items: [
            'T-drill / Spider drill × 5 sets',
            'Split-step reaction cones · 4 min',
            'Speed ladder — side steps · 3 min',
          ],
        }] : []),
      ],
    },

    'heavy-technical': {
      blocks: [
        warmBlock(),
        {
          name: 'Forehand Mechanics',
          duration: x(25, 0.35),
          items: [
            'Slow feed × 30 — hip rotation and shoulder turn',
            'Medium feed × 30 — wrist snap and follow-through',
            'Shadow FH × 20 — exaggerated finish above shoulder',
            f.partner === 'coach' ? 'Video 10 reps for coach review' : 'Self-video 5 reps — compare to reference',
          ],
        },
        {
          name: 'Backhand Mechanics',
          duration: x(22, 0.3),
          items: [
            'Slow feed × 30 — unit turn and early prep',
            'Medium feed × 30 — low-to-high swing path',
            'Shadow BH × 20 — slow-motion full unit turn',
          ],
        },
        {
          name: 'Serve Mechanics',
          duration: x(20, 0.25),
          items: [
            'Ball-toss drill × 20 — consistent contact point',
            'Trophy position pause drill × 15',
            'Full serve × 20 — flat to both boxes',
            'Kick serve × 15 — toss slightly left, brush up and over',
          ],
        },
        ...(dur >= 2.5 ? [{
          name: 'Approach + Net Game',
          duration: '15 min',
          items: [
            'Short ball approach × 15 each wing',
            'First volley close-out × 15',
            'Overhead from short toss · × 12',
          ],
        }] : []),
      ],
    },

    'heavy-tactical': {
      blocks: [
        warmBlock(),
        {
          name: 'Serve Pattern Drilling',
          duration: x(22, 0.3),
          items: [
            'Serve wide + FH attack crosscourt × 20 reps',
            'Serve T + BH rip down-the-line × 20 reps',
            'Serve body + step FH inside-out × 15 reps',
            isClay ? 'High kick to BH + attack short ball × 15 reps' : 'Flat T + rush net and volley × 15 reps',
          ],
        },
        {
          name: 'Return Pattern Drilling',
          duration: x(20, 0.25),
          items: [
            'Return + neutralise — chip BH crosscourt × 20',
            'Return + attack — FH rip crosscourt × 15',
            'Chipped return approach + volley × 15',
          ],
        },
        {
          name: 'Scenario-Based Points',
          duration: x(25, 0.3),
          items: [
            solo ? 'Shadow patterns with cones marking target zones' : 'Coach/feeder starts from specific positions',
            'Execute pattern for 3 shots, then play it out freely',
            'Score: first to 10 wins per position',
          ],
        },
        ...(dur >= 2.5 ? [{
          name: 'Live Competitive Set',
          duration: '20 min',
          items: [
            'Short set — first to 6 games',
            'Call each pattern out loud before executing',
            isClay ? 'Emphasise moon-ball and high kick to BH' : 'Emphasise serve + volley or serve + attack',
          ],
        }] : []),
      ],
    },

    'medium-technical': {
      blocks: [
        warmBlock(),
        {
          name: 'Targeted Stroke Work',
          duration: x(30, 0.4),
          items: [
            solo ? 'Wall practice or shadow swings — 1 stroke focus · 20 min' : 'Cooperative feed — 1 stroke focus per set · 15 min',
            'Slow deliberate repetitions × 40',
            'Medium-pace repetitions × 30',
            isClay ? 'Topspin depth — target 1 m inside baseline' : 'Flat drive — target 0.5 m net clearance',
          ],
        },
        {
          name: solo ? 'Shadow Footwork + Serve' : 'Cooperative Baseline Rallying',
          duration: x(25, 0.35),
          items: solo
            ? ['Shadow footwork — split-step and recover · 5 min', 'Serve practice — mix 1st and 2nd serves · 20 min']
            : ['Medium-pace technical rallying · 15 min', 'Target zone practice — crosscourt deep · 10 min'],
        },
        {
          name: 'Serve Sequence Practice',
          duration: x(20, 0.25),
          items: [
            '1st serve placement × 20 to each box',
            '2nd serve kick × 20 to each box',
            'Serve + 1 groundstroke × 15 patterns',
          ],
        },
      ],
    },

    'medium-tactical': {
      blocks: [
        warmBlock(),
        {
          name: 'Pattern Drilling',
          duration: x(28, 0.4),
          items: [
            isClay
              ? 'Pattern A: BH crosscourt + FH inside-out + attack short × 20'
              : 'Pattern A: FH inside-out + BH down-the-line + approach × 20',
            surface === 'grass' || surface === 'indoor'
              ? 'Pattern B: Serve T + rush net + volley out × 20'
              : 'Pattern B: Wide serve + FH rip + hold position × 20',
            'Transition live points — apply patterns freely · 8 min',
          ],
        },
        {
          name: 'Short Point Competition',
          duration: x(25, 0.35),
          items: [
            solo ? 'Mini-tennis competition scoring · 10 min' : 'King of the court · 10 min',
            'Half-court points — 3-shot entry rule · 10 min',
            'Tiebreak practice · 5 min',
          ],
        },
        {
          name: 'Return Game Focus',
          duration: x(15, 0.25),
          items: [
            'Return + neutralise drill × 15',
            'Return + attack crosscourt × 15',
            solo ? 'Shadow return footwork to cones · 5 min' : 'Read-the-serve game · 5 min',
          ],
        },
      ],
    },

    'light-technical': {
      blocks: [
        {
          name: 'Easy Warm-Up',
          duration: '15 min',
          items: [
            'Mini-tennis — slow and gentle · 8 min',
            'Service line cooperative rallies · 7 min',
          ],
        },
        {
          name: 'Feel & Touch Work',
          duration: x(30, 0.5),
          items: [
            'One stroke only — slow cooperative pace · 20 min',
            'Focus on body feel, not outcome',
            f.hasInjury ? `Modify to avoid loading ${f.injuryLocation}` : 'Slow exaggerated follow-throughs × 20',
            'Drop-feed touch volleys × 20',
          ],
        },
        {
          name: 'Serve Feel',
          duration: x(20, 0.3),
          items: [
            'Easy toss drill × 15 — no pace',
            'Slow-motion serve × 15 — feel the trophy position',
            '2nd serve only × 20 — rhythm over power',
          ],
        },
        ...(dur >= 2.5 ? [{
          name: 'Light Net Game',
          duration: '10 min',
          items: [
            'Soft cooperative volleys · 5 min',
            'Easy overhead from short toss × 12',
          ],
        }] : []),
      ],
    },

    'light-tactical': {
      blocks: [
        {
          name: 'Easy Warm-Up',
          duration: '15 min',
          items: [
            'Mini-tennis — fun, no pressure · 8 min',
            'Service line games · 7 min',
          ],
        },
        {
          name: 'Loose Pattern Play',
          duration: x(25, 0.45),
          items: [
            'No score — move and hit freely · 10 min',
            'One pattern review — 10 reps each side, relaxed pace',
            f.partner === 'coach' ? 'Coach calls patterns — stay loose in execution' : 'Call each pattern before executing',
          ],
        },
        {
          name: 'Mental Practice + Light Points',
          duration: x(25, 0.35),
          items: [
            'Pre-point routine practice — bounce, breathe, focus',
            'Easy live points at 50% intensity · 10 min',
            'Visualise 3 patterns between each point',
          ],
        },
      ],
    },

    'activation-recovery': {
      blocks: [
        {
          name: 'Easy Court Movement',
          duration: '15 min',
          items: [
            'Gentle jog around court × 3 · 4 min',
            'Easy arm swings while walking · 3 min',
            'Side steps half-court × 4 each direction · 4 min',
            'Shoulder rolls with racket · 4 min',
          ],
        },
        {
          name: 'Light Ball Contact',
          duration: '20 min',
          items: [
            'Mini-tennis only — no power, just feel · 10 min',
            'Drop-feed touch volleys — soft hands · 5 min',
            f.hasInjury ? `Avoid any motion loading ${f.injuryLocation}` : 'Easy cooperative crosscourt rallies · 5 min',
          ],
        },
        {
          name: 'Serve Rhythm Only',
          duration: '10 min',
          items: [
            '15 easy serves — toss and rhythm, no pace target',
            'No placement pressure',
            parseInt(f.tournamentDays, 10) <= 1
              ? 'Match-day mental rehearsal — visualise key patterns and first game'
              : 'Breathe and reset between each serve',
          ],
        },
      ],
    },
  }

  const key = `${intensity}-${focus}`
  return {
    duration: durLabel,
    blocks: (sessions[key] ?? sessions['medium-technical']).blocks,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COOLDOWN
// ─────────────────────────────────────────────────────────────────────────────
function buildCooldown(f, intensity) {
  const stretches = {
    heavy: [
      'Hip flexor (lunge position) · 60s each side',
      'Hamstring standing · 60s each side',
      'Quad standing · 45s each side',
      'Calf / Achilles · 45s each side',
      'Chest opener (wall) · 60s',
      'Shoulder cross-body · 45s each side',
      'Lying glute / figure-4 · 60s each side',
      'Pigeon or 90/90 deep hip · 90s each side',
    ],
    medium: [
      'Hip flexor · 45s each side',
      'Hamstring standing · 45s each side',
      'Quad · 45s each side',
      'Calf · 45s each side',
      'Shoulder cross-body · 45s each side',
      'Chest opener · 45s',
    ],
    light: [
      'Hip flexor · 30s each side',
      'Hamstring · 30s each side',
      'Quad + calf sequence · 30s each',
      'Shoulder and neck rolls · 2 min total',
    ],
    activation: [
      'Seated forward fold · 60s',
      'Lying spinal twist · 45s each side',
      'Legs up the wall · 3 min',
    ],
  }

  const mental = {
    heavy:      'Log energy level, one technical win, and one thing to improve. Rate the session 1–10.',
    medium:     "Note one technical or tactical win from today's work.",
    light:      'Check in — does the body feel better than before training? Log any sensations.',
    activation: 'Rest is training. Trust the process. Note mood and readiness for tomorrow.',
  }

  const totalDur = { heavy: '18–22 min', medium: '12–15 min', light: '8–12 min', activation: '8–10 min' }
  const iceItems = (f.hasInjury && parseInt(f.injuryPain, 10) >= 4)
    ? [`Ice ${f.injuryLocation || 'injured area'} · 10–15 min post-session`]
    : []

  return {
    duration: totalDur[intensity],
    blocks: [
      ...(intensity === 'heavy' || intensity === 'medium' ? [{
        name: 'Easy Walk',
        duration: intensity === 'heavy' ? '4 min' : '2 min',
        items: intensity === 'heavy'
          ? ['Walk baseline to net × 3 slowly', 'Deep breaths — in 4 counts, out 6']
          : ['Easy walk around court perimeter'],
      }] : []),
      {
        name: 'Static Stretching',
        duration: intensity === 'heavy' ? '12 min' : intensity === 'medium' ? '8 min' : '6 min',
        items: stretches[intensity],
      },
      ...(iceItems.length ? [{
        name: 'Injury Care',
        duration: '10–15 min',
        items: iceItems,
      }] : []),
      {
        name: 'Mental Review',
        duration: intensity === 'heavy' ? '5 min' : '3 min',
        items: [
          mental[intensity],
          ...(f.coachNote?.trim() ? [`Coach note: "${f.coachNote.trim()}"`] : []),
        ],
      },
    ],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────
const INTENSITY_LABELS = { heavy: 'Heavy Load', medium: 'Medium Load', light: 'Light Load', activation: 'Activation' }
const FOCUS_LABELS     = { endurance: 'Endurance', technical: 'Technical', tactical: 'Tactical', recovery: 'Recovery' }

export function calculatePlan(inputs) {
  const intensity = calcIntensity(inputs)
  const focus     = calcFocus(inputs, intensity)
  return {
    intensity,
    intensityLabel: INTENSITY_LABELS[intensity],
    focus,
    focusLabel:     FOCUS_LABELS[focus],
    warmup:         buildWarmup(inputs, intensity),
    tennisSession:  buildTennisSession(inputs, intensity, focus),
    cooldown:       buildCooldown(inputs, intensity),
  }
}
