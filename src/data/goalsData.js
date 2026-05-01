import { useLocalStorage } from './storage'

export const CATEGORIES = ['Technical', 'Physical', 'Mental', 'Competition']

const SAMPLE = [
  { id: 1, title: 'Improve kick serve consistency', category: 'Technical', targetDate: '2026-06-01', progress: 45, notes: 'Focus on toss location and wrist snap', completed: false },
  { id: 2, title: 'Win an ITF junior tournament', category: 'Competition', targetDate: '2026-07-15', progress: 20, notes: 'Spring Open was good preparation', completed: false },
  { id: 3, title: 'First serve % above 70', category: 'Technical', targetDate: '2026-05-15', progress: 68, notes: '', completed: false },
  { id: 4, title: 'Run 5 km under 22 minutes', category: 'Physical', targetDate: '2026-05-01', progress: 100, notes: '', completed: true },
  { id: 5, title: 'Daily pre-sleep visualisation', category: 'Mental', targetDate: '2026-05-31', progress: 60, notes: '5 min before sleep, key match scenarios', completed: false },
]

export function useGoals() {
  const [goals, set] = useLocalStorage('baseline_goals', SAMPLE)

  const add = (g) => set([{ ...g, id: Date.now(), completed: false }, ...goals])

  const setProgress = (id, progress) =>
    set(goals.map(g => g.id === id ? { ...g, progress } : g))

  const toggle = (id) =>
    set(goals.map(g => g.id === id ? { ...g, completed: !g.completed, progress: g.completed ? g.progress : 100 } : g))

  const remove = (id) => set(goals.filter(g => g.id !== id))

  return { goals, add, setProgress, toggle, remove }
}
