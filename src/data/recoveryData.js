import { useLocalStorage } from './storage'

export const MODALITIES = ['Ice Bath', 'Massage', 'Foam Roll', 'Sauna', 'Yoga', 'Cold Shower', 'Stretching', 'Meditation']

const SAMPLE = [
  { id: 1, date: '2026-04-27', sleepHours: 8,   sleepQuality: 4, soreness: 2, energy: 4, modalities: ['Foam Roll', 'Stretching'], notes: 'Felt great after solid sleep' },
  { id: 2, date: '2026-04-26', sleepHours: 6.5, sleepQuality: 3, soreness: 3, energy: 3, modalities: ['Ice Bath'],                 notes: 'Legs sore from match' },
  { id: 3, date: '2026-04-25', sleepHours: 7,   sleepQuality: 4, soreness: 4, energy: 3, modalities: ['Massage', 'Stretching'],    notes: 'Post-tournament fatigue' },
  { id: 4, date: '2026-04-24', sleepHours: 7.5, sleepQuality: 5, soreness: 1, energy: 5, modalities: ['Foam Roll'],                notes: 'Rest day, felt fully recovered' },
]

export function calcScore(c) {
  const sleep    = (c.sleepQuality / 5) * 30
  const soreness = ((5 - c.soreness) / 4) * 30
  const energy   = (c.energy / 5) * 25
  const bonus    = Math.min((c.modalities?.length ?? 0) * 3, 15)
  return Math.round(sleep + soreness + energy + bonus)
}

export function scoreInfo(s) {
  if (s >= 80) return { label: 'Excellent', color: 'var(--accent)' }
  if (s >= 60) return { label: 'Good',      color: '#4ade80' }
  if (s >= 40) return { label: 'Fair',      color: '#fbbf24' }
  return              { label: 'Poor',      color: '#f87171' }
}

export function useRecovery() {
  const [checks, set] = useLocalStorage('baseline_recovery', SAMPLE)
  const today = new Date().toISOString().split('T')[0]
  const todayCheck = checks.find(c => c.date === today) ?? null

  function save(data) {
    const entry = { ...data, id: Date.now(), date: today }
    const idx = checks.findIndex(c => c.date === today)
    set(idx >= 0 ? checks.map((c, i) => i === idx ? entry : c) : [entry, ...checks])
  }

  return { checks, todayCheck, save }
}
