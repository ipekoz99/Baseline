import { useState } from 'react'
import Icon from '../components/Icon'

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`toggle${checked ? ' toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-thumb" />
    </button>
  )
}

function SettingsRow({ icon, label, sub, right }) {
  return (
    <div className="settings-row">
      <div className="settings-row-icon">
        <Icon name={icon} size={16} />
      </div>
      <div className="settings-row-body">
        <div className="settings-row-label">{label}</div>
        {sub && <div className="settings-row-sub">{sub}</div>}
      </div>
      <div className="settings-row-right">{right}</div>
    </div>
  )
}

export default function Settings() {
  const [notifs, setNotifs] = useState(true)
  const [reminders, setReminders] = useState(true)
  const [insights, setInsights] = useState(false)

  return (
    <div className="screen settings-screen">
      <h1 className="settings-title">Settings</h1>

      <section className="settings-section">
        <h2 className="settings-heading">Notifications</h2>
        <div className="settings-group">
          <SettingsRow
            icon="bell"
            label="Push notifications"
            sub="Session reminders & updates"
            right={<Toggle checked={notifs} onChange={setNotifs} />}
          />
          <SettingsRow
            icon="activity"
            label="Training reminders"
            sub="Daily practice nudges"
            right={<Toggle checked={reminders} onChange={setReminders} />}
          />
          <SettingsRow
            icon="sparkles"
            label="AI weekly insights"
            sub="Performance summaries"
            right={<Toggle checked={insights} onChange={setInsights} />}
          />
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-heading">Data</h2>
        <div className="settings-group">
          <SettingsRow
            icon="shield"
            label="Privacy"
            sub="Manage your data"
            right={<Icon name="chevron-right" size={16} />}
          />
          <SettingsRow
            icon="users"
            label="Share with coach"
            sub="Sync performance data"
            right={<Icon name="chevron-right" size={16} />}
          />
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-heading">About</h2>
        <div className="settings-group">
          <SettingsRow
            icon="info"
            label="Baseline"
            sub="Version 1.0.0"
            right={<span className="settings-badge">v1.0</span>}
          />
        </div>
      </section>
    </div>
  )
}
