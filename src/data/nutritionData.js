import { useLocalStorage } from './storage'

export const TARGETS = { calories: 2800, protein: 180, carbs: 320, fat: 90, water: 8 }

export const MEAL_TYPES = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Post-Training']

const todayKey = () => new Date().toISOString().split('T')[0]

export function useNutrition() {
  const [data, set] = useLocalStorage('baseline_nutrition', {})

  const today = todayKey()
  const day = data[today] ?? { meals: [], water: 0 }

  const totals = day.meals.reduce(
    (a, m) => ({ calories: a.calories + (+m.calories || 0), protein: a.protein + (+m.protein || 0), carbs: a.carbs + (+m.carbs || 0), fat: a.fat + (+m.fat || 0) }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const update = (next) => set({ ...data, [today]: next })

  const addMeal = (m) => update({ ...day, meals: [...day.meals, { ...m, id: Date.now() }] })
  const deleteMeal = (id) => update({ ...day, meals: day.meals.filter(m => m.id !== id) })
  const setWater = (n) => update({ ...day, water: Math.max(0, Math.min(12, n)) })

  return { meals: day.meals, water: day.water, totals, addMeal, deleteMeal, setWater }
}
