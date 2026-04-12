import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Home from './screens/Home'
import Profile from './screens/Profile'
import Settings from './screens/Settings'
import './App.css'

const SCREENS = { home: Home, profile: Profile, settings: Settings }

export default function App() {
  const [tab, setTab] = useState('home')
  const [selectedSection, setSelectedSection] = useState(null)
  const Screen = SCREENS[tab]

  return (
    <div className="app">
      <div className="app-scroll">
        <Screen onSectionSelect={setSelectedSection} />
      </div>
      <BottomNav active={tab} onNavigate={setTab} />
    </div>
  )
}
