import Icon from './Icon'

const TABS = [
  { id: 'home',     label: 'Home',     icon: 'home'     },
  { id: 'profile',  label: 'Profile',  icon: 'user'     },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {TABS.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            className={`nav-tab${isActive ? ' nav-tab--active' : ''}`}
            onClick={() => onNavigate(tab.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="nav-tab-icon">
              {isActive && <span className="nav-tab-glow" />}
              <Icon name={tab.icon} size={22} />
            </span>
            <span className="nav-tab-label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
