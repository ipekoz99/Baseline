import { useState } from 'react'
import NavBar from './components/NavBar'
import Dashboard from './screens/Dashboard'
import Players from './screens/Players'
import Matches from './screens/Matches'
import './App.css'

const SCREENS = { dashboard: Dashboard, players: Players, matches: Matches }

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const Screen = SCREENS[screen]

  return (
    <div className="app">
      <NavBar active={screen} onNavigate={setScreen} />
      <main className="main-content">
        <Screen />
      </main>
    </div>
  )
}
