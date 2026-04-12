import Icon from './Icon'

const TABS = [
  { id: 'home',     label: 'Home',    icon: 'home' },
  { id: 'profile',  label: 'Profile', icon: 'user' },
  { id: 'settings', label: 'Settings',icon: 'settings' },
]

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab${active === tab.id ? ' nav-tab--active' : ''}`}
          onClick={() => onNavigate(tab.id)}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          <span className="nav-tab-icon">
            <Icon name={tab.icon} size={22} />
          </span>
          <span className="nav-tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
