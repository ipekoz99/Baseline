import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Home from './screens/Home'
import Profile from './screens/Profile'
import Settings from './screens/Settings'
import Training from './screens/Training'
import MatchJournal from './screens/MatchJournal'
import './App.css'

const TAB_SCREENS = { home: Home, profile: Profile, settings: Settings }

// Sections that have a dedicated screen
const SECTION_SCREENS = { training: Training, 'match-journal': MatchJournal }

export default function App() {
  const [tab, setTab]         = useState('home')
  const [section, setSection] = useState(null)

  function navigateTab(newTab) {
    setTab(newTab)
    setSection(null)
  }

  function handleSectionSelect(s) {
    if (SECTION_SCREENS[s.id]) setSection(s.id)
  }

  const SectionScreen = section ? SECTION_SCREENS[section] : null
  const TabScreen     = TAB_SCREENS[tab]

  return (
    <div className="app">
      <div className="app-scroll">
        {SectionScreen ? (
          <SectionScreen onBack={() => setSection(null)} />
        ) : (
          <TabScreen onSectionSelect={handleSectionSelect} />
        )}
      </div>
      <BottomNav active={section ? null : tab} onNavigate={navigateTab} />
    </div>
  )
}
