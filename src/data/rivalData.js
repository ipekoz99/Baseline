import { useLocalStorage } from './storage'

const SAMPLE = [
  {
    id: 1,
    name: 'S. Müller',
    nationality: 'GER',
    ranking: 5,
    surface: 'Clay',
    style: 'Baseline Grinder',
    strengths: ['Heavy topspin BH', 'Deep return', 'High kick serve', 'Mental resilience'],
    weaknesses: ['Short balls', 'Net approach', 'Flat hard-court pace'],
    h2w: 1, h2l: 2,
    lastFaced: '2026-04-20',
    notes: 'Drags you into long rallies. Must attack short balls early. Serve to FH when under pressure.',
  },
  {
    id: 2,
    name: 'K. Tanaka',
    nationality: 'JPN',
    ranking: 33,
    surface: 'Hard',
    style: 'Counter-Puncher',
    strengths: ['Elite retrieval speed', 'Crosscourt BH consistency', 'Tiebreak mentality'],
    weaknesses: ['Aggressive BH DTL', 'Body serve', 'High balls to FH'],
    h2w: 2, h2l: 1,
    lastFaced: '2026-04-25',
    notes: 'Very fast — shorten points. Body serve effective. Inside-out FH to open the court.',
  },
  {
    id: 3,
    name: 'A. Djordic',
    nationality: 'SRB',
    ranking: 18,
    surface: 'Indoor',
    style: 'Big Hitter',
    strengths: ['Flat FH power', 'First-serve ace threat', 'Net dominance'],
    weaknesses: ['2nd serve to BH', 'Foot speed on wide balls', 'Extended rallies'],
    h2w: 2, h2l: 0,
    lastFaced: '2026-03-28',
    notes: 'Make him play longer than he wants. Attack 2nd serve. Push into defensive corners.',
  },
]

export const STYLES = ['Baseline Grinder', 'Counter-Puncher', 'Big Hitter', 'All-Court', 'Serve & Volley', 'Retriever']

export function useRivals() {
  const [rivals, set] = useLocalStorage('baseline_rivals', SAMPLE)
  const add    = (r) => set([{ ...r, id: Date.now(), h2w: 0, h2l: 0 }, ...rivals])
  const remove = (id) => set(rivals.filter(r => r.id !== id))
  return { rivals, add, remove }
}
