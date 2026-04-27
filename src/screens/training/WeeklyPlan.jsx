// Build 7-day array starting from the most recent Monday
function getWeekDays() {
  const today = new Date()
  const dow = today.getDay() // 0=Sun … 6=Sat
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const DAY_NAMES  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SHORT_MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// Sample plan data indexed by weekday (0=Mon … 6=Sun)
const SAMPLE = [
  { type: 'training', intensity: 'heavy',  focus: 'Tactical',   note: 'Serve patterns + live sets' },
  { type: 'training', intensity: 'medium', focus: 'Technical',  note: 'FH mechanics + serve' },
  { type: 'rest',     intensity: null,     focus: null,          note: 'Full recovery day' },
  { type: 'training', intensity: 'heavy',  focus: 'Endurance',  note: 'Baseline endurance + fitness' },
  { type: 'training', intensity: 'light',  focus: 'Technical',  note: 'Touch work + serve feel' },
  { type: 'match',    intensity: null,     focus: null,          note: 'Spring Open · R2' },
  { type: 'rest',     intensity: null,     focus: null,          note: 'Recovery + mental reset' },
]

const INTENSITY_LABELS = { heavy: 'Heavy', medium: 'Medium', light: 'Light', activation: 'Activation' }

const TYPE_CLASS = { training: 'day-type--training', rest: 'day-type--rest', match: 'day-type--match' }

function todayIndex() {
  const dow = new Date().getDay()
  return (dow + 6) % 7 // convert Sun=0…Sat=6 → Mon=0…Sun=6
}

export default function WeeklyPlan() {
  const days   = getWeekDays()
  const today  = todayIndex()

  const loadCounts = SAMPLE.reduce((acc, d) => {
    if (d.type === 'training') acc[d.intensity] = (acc[d.intensity] || 0) + 1
    if (d.type === 'match')    acc.match         = (acc.match || 0) + 1
    if (d.type === 'rest')     acc.rest          = (acc.rest || 0) + 1
    return acc
  }, {})

  return (
    <div className="weekly-plan">

      {/* Load summary */}
      <div className="week-summary">
        <p className="week-summary-label">Weekly Load</p>
        <div className="week-load-tags">
          {loadCounts.heavy      && <span className="load-tag load-tag--heavy">{loadCounts.heavy} Heavy</span>}
          {loadCounts.medium     && <span className="load-tag load-tag--medium">{loadCounts.medium} Medium</span>}
          {loadCounts.light      && <span className="load-tag load-tag--light">{loadCounts.light} Light</span>}
          {loadCounts.activation && <span className="load-tag load-tag--activation">{loadCounts.activation} Activation</span>}
          {loadCounts.match      && <span className="load-tag load-tag--match">{loadCounts.match} Match</span>}
          {loadCounts.rest       && <span className="load-tag load-tag--rest">{loadCounts.rest} Rest</span>}
        </div>
      </div>

      {/* Day grid */}
      <div className="week-grid">
        {SAMPLE.map((day, i) => {
          const date = days[i]
          const isToday = i === today
          return (
            <div key={i} className={`day-card${isToday ? ' day-card--today' : ''}`}>
              <div className="day-header">
                <span className="day-name">{DAY_NAMES[i]}</span>
                <span className="day-date">
                  {date.getDate()} {SHORT_MONTH[date.getMonth()]}
                </span>
              </div>

              <span className={`day-type-badge ${TYPE_CLASS[day.type] || ''}`}>
                {day.type.charAt(0).toUpperCase() + day.type.slice(1)}
              </span>

              {day.intensity && (
                <span className={`day-intensity-badge day-intensity--${day.intensity}`}>
                  {INTENSITY_LABELS[day.intensity]}
                </span>
              )}

              {day.focus && (
                <span className="day-focus">{day.focus}</span>
              )}

              <p className="day-note">{day.note}</p>

              {isToday && <span className="today-dot" aria-label="Today" />}
            </div>
          )
        })}
      </div>

    </div>
  )
}
