import { useState } from 'react'
import Icon from '../components/Icon'
import { useNutrition, TARGETS, MEAL_TYPES } from '../data/nutritionData'

const MACROS = [
  { label: 'Calories', key: 'calories', unit: 'kcal', color: 'var(--accent)' },
  { label: 'Protein',  key: 'protein',  unit: 'g',    color: '#63b3ed' },
  { label: 'Carbs',    key: 'carbs',    unit: 'g',    color: '#f6ad55' },
  { label: 'Fat',      key: 'fat',      unit: 'g',    color: '#fc8181' },
]

export default function Nutrition({ onBack }) {
  const { meals, water, totals, addMeal, deleteMeal, setWater } = useNutrition()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'Breakfast', name: '', calories: '', protein: '', carbs: '', fat: '' })

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    addMeal(form)
    setShowForm(false)
    setForm({ type: 'Breakfast', name: '', calories: '', protein: '', carbs: '', fat: '' })
  }

  return (
    <div className="section-screen">
      <div className="section-screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="chevron-left" size={18} /></button>
        <span className="section-screen-title">Nutrition</span>
        <button className="add-match-btn" onClick={() => setShowForm(v => !v)}>
          <Icon name="plus" size={14} /> Log
        </button>
      </div>

      {/* Daily macro summary */}
      <div className="nutrition-summary">
        {MACROS.map(m => (
          <div key={m.key} className="macro-row">
            <div className="macro-label-row">
              <span className="macro-label">{m.label}</span>
              <span className="macro-values" style={{ color: m.color }}>
                {totals[m.key]}
                <span className="macro-target"> / {TARGETS[m.key]} {m.unit}</span>
              </span>
            </div>
            <div className="macro-bar-track">
              <div className="macro-bar-fill"
                style={{ width: `${Math.min(100, (totals[m.key] / TARGETS[m.key]) * 100)}%`, background: m.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Water tracker */}
      <div className="water-card">
        <div className="water-header">
          <span className="water-label">Hydration</span>
          <span className="water-count">{water} / {TARGETS.water} glasses</span>
        </div>
        <div className="water-dots">
          {Array.from({ length: TARGETS.water }).map((_, i) => (
            <button key={i}
              className={`water-dot${i < water ? ' water-dot--filled' : ''}`}
              onClick={() => setWater(i < water ? i : i + 1)}
              aria-label={`Glass ${i + 1}`} />
          ))}
        </div>
      </div>

      {/* Add meal form */}
      {showForm && (
        <form className="form-section goals-form" onSubmit={submit}>
          <div className="form-section-title">Log Meal</div>
          <div className="form-field">
            <label className="form-label">Meal Type</label>
            <div className="chip-group">
              {MEAL_TYPES.map(t => (
                <button type="button" key={t}
                  className={`chip${form.type === t ? ' chip--active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: t }))}>{t}</button>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Food / Meal Name</label>
            <input className="text-input" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Chicken rice bowl" required />
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="form-label">Calories</label>
              <input type="number" className="text-input" value={form.calories}
                onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} placeholder="kcal" min={0} />
            </div>
            <div className="form-field">
              <label className="form-label">Protein (g)</label>
              <input type="number" className="text-input" value={form.protein}
                onChange={e => setForm(f => ({ ...f, protein: e.target.value }))} placeholder="g" min={0} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label className="form-label">Carbs (g)</label>
              <input type="number" className="text-input" value={form.carbs}
                onChange={e => setForm(f => ({ ...f, carbs: e.target.value }))} placeholder="g" min={0} />
            </div>
            <div className="form-field">
              <label className="form-label">Fat (g)</label>
              <input type="number" className="text-input" value={form.fat}
                onChange={e => setForm(f => ({ ...f, fat: e.target.value }))} placeholder="g" min={0} />
            </div>
          </div>
          <div className="form-action-row">
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="generate-btn form-save-btn">Save</button>
          </div>
        </form>
      )}

      <div className="section-heading">Today's Meals</div>
      {meals.length === 0 ? (
        <div className="journal-empty">No meals logged yet.<br /><strong>Tap Log</strong> to add your first meal.</div>
      ) : (
        <div className="meals-list">
          {meals.map(m => (
            <div key={m.id} className="meal-item">
              <div className="meal-item-body">
                <div className="meal-item-top">
                  <span className="meal-type-chip">{m.type}</span>
                  <span className="meal-name">{m.name}</span>
                </div>
                <div className="meal-macros">
                  {m.calories && <span>{m.calories} kcal</span>}
                  {m.protein  && <span>P {m.protein}g</span>}
                  {m.carbs    && <span>C {m.carbs}g</span>}
                  {m.fat      && <span>F {m.fat}g</span>}
                </div>
              </div>
              <button className="goal-delete-btn" onClick={() => deleteMeal(m.id)} aria-label="Delete meal">
                <Icon name="trash-2" size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
