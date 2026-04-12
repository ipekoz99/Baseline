import Icon from './Icon'

export default function SectionCard({ section, onClick, variant = 'default' }) {
  if (variant === 'ai') {
    return (
      <button className="section-card section-card--ai" onClick={onClick}>
        <div className="ai-card-inner">
          <div className="ai-card-icon">
            <Icon name="sparkles" size={22} />
          </div>
          <div className="ai-card-body">
            <div className="ai-card-label">{section.label}</div>
            <div className="ai-card-status">{section.status}</div>
          </div>
        </div>
        <Icon name="chevron-right" size={18} />
      </button>
    )
  }

  return (
    <button className="section-card" onClick={onClick}>
      <div className="card-icon">
        <Icon name={section.icon} size={20} />
      </div>
      <div className="card-label">{section.label}</div>
      <div className="card-status">{section.status}</div>
    </button>
  )
}
