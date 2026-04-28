import { useState } from 'react'

// ─── Constants ─────────────────────────────────────────────────────────────
export const SURFACES = [
  { value: 'clay',   label: 'Clay' },
  { value: 'hard',   label: 'Hard' },
  { value: 'grass',  label: 'Grass' },
  { value: 'indoor', label: 'Indoor' },
]

export const ROUNDS = [
  { value: 'R64', label: 'R64' },
  { value: 'R32', label: 'R32' },
  { value: 'R16', label: 'R16' },
  { value: 'QF',  label: 'QF'  },
  { value: 'SF',  label: 'SF'  },
  { value: 'F',   label: 'F'   },
]

export const RATING_KEYS = ['serve', 'return', 'forehand', 'backhand', 'movement', 'mental']
export const RATING_LABELS = {
  serve: 'Serve', return: 'Return', forehand: 'Forehand',
  backhand: 'Backhand', movement: 'Movement', mental: 'Mental',
}

// ─── Sample data ────────────────────────────────────────────────────────────
const SAMPLE = [
  {
    id: 1,
    date: '2026-04-25',
    opponent: 'K. Tanaka',
    tournament: 'Spring Open',
    round: 'SF',
    surface: 'clay',
    score: '6-3, 7-5',
    result: 'win',
    duration: 88,
    ratings: { serve: 4, return: 3, forehand: 5, backhand: 3, movement: 4, mental: 4 },
    notes: 'First serve percentage was high. Dominated crosscourt FH exchanges from mid-court.',
    improve: 'BH under pressure, kick serve to the ad court',
  },
  {
    id: 2,
    date: '2026-04-20',
    opponent: 'S. Müller',
    tournament: 'Spring Open',
    round: 'QF',
    surface: 'clay',
    score: '4-6, 3-6',
    result: 'loss',
    duration: 72,
    ratings: { serve: 2, return: 3, forehand: 3, backhand: 2, movement: 3, mental: 2 },
    notes: 'Struggled with deep topspin returns. Could not find rhythm on the BH side all match.',
    improve: 'Return positioning vs heavy spin, BH topspin depth',
  },
  {
    id: 3,
    date: '2026-04-15',
    opponent: 'T. Wang',
    tournament: 'Spring Open',
    round: 'R16',
    surface: 'clay',
    score: '7-5, 6-4',
    result: 'win',
    duration: 95,
    ratings: { serve: 3, return: 4, forehand: 4, backhand: 4, movement: 5, mental: 4 },
    notes: 'Great movement and court coverage. Stayed consistent from the baseline.',
    improve: 'Net game and approach shots on clay',
  },
  {
    id: 4,
    date: '2026-04-08',
    opponent: 'M. Fernandez',
    tournament: '',
    round: '',
    surface: 'hard',
    score: '6-4, 6-7, 6-3',
    result: 'win',
    duration: 142,
    ratings: { serve: 5, return: 3, forehand: 4, backhand: 3, movement: 4, mental: 5 },
    notes: 'Mental strength in the 3rd set was the deciding factor.',
    improve: 'Return on hard court, 2nd set tiebreak decision-making',
  },
  {
    id: 5,
    date: '2026-04-01',
    opponent: 'J. Novak',
    tournament: '',
    round: '',
    surface: 'indoor',
    score: '3-6, 5-7',
    result: 'loss',
    duration: 68,
    ratings: { serve: 3, return: 2, forehand: 3, backhand: 2, movement: 3, mental: 2 },
    notes: 'Flat day. The speed of play on indoor caught me off guard.',
    improve: 'Indoor pace adaptation, volley game',
  },
  {
    id: 6,
    date: '2026-03-28',
    opponent: 'A. Djordic',
    tournament: 'Indoor Masters',
    round: 'F',
    surface: 'indoor',
    score: '6-4, 6-3',
    result: 'win',
    duration: 78,
    ratings: { serve: 5, return: 4, forehand: 5, backhand: 4, movement: 4, mental: 5 },
    notes: 'Best match of the year. Everything clicked — serve, movement, tactics.',
    improve: 'Nothing specific today — replicate this mindset',
  },
]

// ─── Storage key ────────────────────────────────────────────────────────────
const KEY = 'baseline_matches'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : SAMPLE
  } catch {
    return SAMPLE
  }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

// ─── Hook ───────────────────────────────────────────────────────────────────
export function useMatches() {
  const [matches, setMatches] = useState(load)

  function addMatch(match) {
    const updated = [{ ...match, id: Date.now() }, ...matches]
    setMatches(updated)
    save(updated)
  }

  function deleteMatch(id) {
    const updated = matches.filter((m) => m.id !== id)
    setMatches(updated)
    save(updated)
  }

  return { matches, addMatch, deleteMatch }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function calcStats(matches) {
  const wins   = matches.filter((m) => m.result === 'win').length
  const losses = matches.filter((m) => m.result === 'loss').length
  const total  = wins + losses
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0

  const recentForm = matches.slice(0, 5).map((m) => m.result)

  // Surface win rates (min 2 matches)
  const surf = {}
  matches.forEach((m) => {
    if (!m.surface) return
    if (!surf[m.surface]) surf[m.surface] = { w: 0, n: 0 }
    surf[m.surface].n++
    if (m.result === 'win') surf[m.surface].w++
  })
  const bestSurface = Object.entries(surf)
    .filter(([, s]) => s.n >= 2)
    .sort((a, b) => b[1].w / b[1].n - a[1].w / a[1].n)[0] ?? null

  return { wins, losses, winRate, recentForm, bestSurface }
}

export function avgRating(ratings) {
  if (!ratings) return 0
  const vals = Object.values(ratings)
  return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : 0
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
