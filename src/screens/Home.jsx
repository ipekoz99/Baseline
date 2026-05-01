import { sections, aiSection } from '../data/sections'
import SectionCard from '../components/SectionCard'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const TODAY = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

export default function Home({ onSectionSelect }) {
  return (
    <div className="screen home-screen">
      {/* Ambient glow */}
      <div className="home-ambient" aria-hidden="true" />

      {/* Header */}
      <header className="home-header">
        <div className="home-header-text">
          <p className="greeting">{getGreeting()}</p>
          <h1 className="player-name">Alex Rivera</h1>
          <p className="home-date">{TODAY}</p>
        </div>
        <div className="avatar" aria-label="Player avatar">AR</div>
      </header>

      {/* Quick stats strip */}
      <div className="stats-strip">
        <div className="stat-pill">
          <span className="stat-pill-value">Rank #12</span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-value">72% Win Rate</span>
        </div>
        <div className="stat-pill stat-pill--accent">
          <span className="stat-pill-value">14-day streak</span>
        </div>
      </div>

      {/* Section grid */}
      <section className="sections-section">
        <h2 className="sections-heading">Your Toolkit</h2>
        <div className="sections-grid">
          {sections.map((s) => (
            <SectionCard
              key={s.id}
              section={s}
              onClick={() => onSectionSelect?.(s)}
            />
          ))}
        </div>
      </section>

      {/* AI card */}
      <SectionCard
        section={aiSection}
        variant="ai"
        onClick={() => onSectionSelect?.(aiSection)}
      />
    </div>
  )
}
