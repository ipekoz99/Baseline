import { useState } from 'react'
import Icon from '../components/Icon'
import DailyForm from './training/DailyForm'
import DailyResult from './training/DailyResult'
import WeeklyPlan from './training/WeeklyPlan'
import { calculatePlan } from '../data/trainingLogic'

export default function Training({ onBack }) {
  const [mode, setMode]   = useState('daily')   // 'daily' | 'weekly'
  const [plan, setPlan]   = useState(null)       // null = show form

  function handleGenerate(formData) {
    setPlan(calculatePlan(formData))
  }

  function handleReset() {
    setPlan(null)
  }

  return (
    <div className="section-screen">

      {/* Header */}
      <header className="section-screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Back to home">
          <Icon name="chevron-left" size={20} />
        </button>
        <h1 className="section-screen-title">Training</h1>
      </header>

      {/* Mode toggle — only visible when not showing a result */}
      {!plan && (
        <div className="mode-tabs">
          <button
            className={`mode-tab${mode === 'daily' ? ' mode-tab--active' : ''}`}
            onClick={() => setMode('daily')}
          >
            Daily Plan
          </button>
          <button
            className={`mode-tab${mode === 'weekly' ? ' mode-tab--active' : ''}`}
            onClick={() => setMode('weekly')}
          >
            Weekly Plan
          </button>
        </div>
      )}

      {/* Content */}
      {plan ? (
        <DailyResult plan={plan} onReset={handleReset} />
      ) : mode === 'daily' ? (
        <DailyForm onGenerate={handleGenerate} />
      ) : (
        <WeeklyPlan />
      )}

    </div>
  )
}
