import { useLocalStorage } from './storage'

const SAMPLE = [
  { id: 1, name: 'Spring Open',          location: 'Barcelona, Spain',     surface: 'clay',   startDate: '2026-04-14', endDate: '2026-04-26', drawSize: '32',  status: 'completed', round: 'SF', notes: 'Lost to top seed in SF. Strong performance overall.' },
  { id: 2, name: 'Youth Cup',            location: 'Paris, France',        surface: 'clay',   startDate: '2026-05-10', endDate: '2026-05-17', drawSize: '64',  status: 'upcoming',  round: '',   notes: '' },
  { id: 3, name: 'Summer Indoor Series', location: 'Berlin, Germany',      surface: 'indoor', startDate: '2026-06-05', endDate: '2026-06-12', drawSize: '32',  status: 'upcoming',  round: '',   notes: '' },
  { id: 4, name: 'Indoor Masters',       location: 'Amsterdam, Netherlands',surface: 'indoor', startDate: '2026-03-20', endDate: '2026-03-28', drawSize: '32',  status: 'completed', round: 'F',  notes: 'Won the title — best result of the season.' },
]

export const DRAW_SIZES = ['16', '32', '64', '128']
export const ROUNDS     = ['R128', 'R64', 'R32', 'R16', 'QF', 'SF', 'F']
export const STATUSES   = ['upcoming', 'in-progress', 'completed']

export function useTournaments() {
  const [list, set] = useLocalStorage('baseline_tournaments', SAMPLE)

  const today = new Date().toISOString().split('T')[0]
  const upcoming = [...list].filter(t => t.status !== 'completed').sort((a, b) => a.startDate.localeCompare(b.startDate))
  const past     = [...list].filter(t => t.status === 'completed').sort((a, b) => b.startDate.localeCompare(a.startDate))

  const add    = (t) => set([{ ...t, id: Date.now() }, ...list])
  const remove = (id) => set(list.filter(t => t.id !== id))

  return { upcoming, past, add, remove }
}
