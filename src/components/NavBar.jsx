export default function NavBar({ active, onNavigate }) {
  const links = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'players', label: 'Players' },
    { id: 'matches', label: 'Matches' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-brand">Baseline</div>
      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link.id}>
            <button
              className={active === link.id ? 'nav-link active' : 'nav-link'}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
