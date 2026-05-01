import { useState, useEffect } from 'react'
import Icon from '../components/Icon'

const WMO = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Light showers', 81: 'Showers', 82: 'Violent showers',
  85: 'Snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Thunderstorm w/ heavy hail',
}

const COURTS = [
  { surface: 'Clay',   ok: (code, wind) => code < 61 && wind < 40,       note: 'Needs dry conditions' },
  { surface: 'Hard',   ok: (code, wind) => code < 80 && wind < 45,       note: 'Dries quickly after light rain' },
  { surface: 'Grass',  ok: (code, wind) => code < 61 && wind < 35,       note: 'Slippery when wet' },
  { surface: 'Indoor', ok: ()            => true,                         note: 'Always available' },
]

function getAdvice(code, wind, temp) {
  if (code >= 95) return { ok: false, text: 'Thunderstorm — do not train outdoors. Move to an indoor court or gym.' }
  if (code >= 61 && code <= 82) return { ok: false, text: 'Rain — courts likely wet. Switch to indoor or gym session.' }
  if (wind > 40) return { ok: false, text: `Strong wind (${wind} km/h) — outdoor practice difficult. Focus on serve technique indoors.` }
  if (temp < 5)  return { ok: true,  text: 'Cold conditions — extend warm-up to 20 min. Watch for muscle tightness.' }
  if (temp > 32) return { ok: true,  text: 'Hot and humid — hydrate every changeover. Schedule play outside peak sun hours.' }
  if (code <= 2)  return { ok: true,  text: 'Excellent outdoor conditions. Perfect for a full session.' }
  return { ok: true, text: 'Acceptable outdoor conditions. Check court surface before starting.' }
}

export default function Weather({ onBack }) {
  const [status, setStatus]   = useState('loading')
  const [weather, setWeather] = useState(null)
  const [coords, setCoords]   = useState(null)
  const [error, setError]     = useState('')

  useEffect(() => { load() }, [])

  function load() {
    setStatus('loading')
    setError('')
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      setStatus('error')
      return
    }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh&timezone=auto`
          const res  = await fetch(url)
          const data = await res.json()
          const c    = data.current
          setWeather({
            temp:     Math.round(c.temperature_2m),
            feels:    Math.round(c.apparent_temperature),
            humidity: c.relative_humidity_2m,
            wind:     Math.round(c.wind_speed_10m),
            code:     c.weather_code,
          })
          setCoords({ lat: lat.toFixed(2), lon: lon.toFixed(2) })
          setStatus('done')
        } catch {
          setError('Failed to fetch weather data. Check your connection.')
          setStatus('error')
        }
      },
      () => {
        setError('Location access denied. Enable location permissions and try again.')
        setStatus('error')
      },
      { timeout: 10000 }
    )
  }

  return (
    <div className="section-screen">
      <div className="section-screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="chevron-left" size={18} /></button>
        <span className="section-screen-title">Weather</span>
        {status !== 'loading' && (
          <button className="add-match-btn" onClick={load} style={{ marginLeft: 'auto' }}>Refresh</button>
        )}
      </div>

      {status === 'loading' && (
        <div className="weather-loading">
          <div className="weather-spinner" />
          <span>Fetching local weather…</span>
        </div>
      )}

      {status === 'error' && (
        <div className="weather-error">
          <Icon name="cloud-sun" size={44} />
          <p className="weather-error-text">{error}</p>
          <button className="generate-btn" style={{ marginTop: 'var(--s4)' }} onClick={load}>Try Again</button>
        </div>
      )}

      {status === 'done' && weather && (() => {
        const advice = getAdvice(weather.code, weather.wind, weather.temp)
        return (
          <>
            <div className="weather-card">
              {coords && (
                <div className="weather-coords">
                  <Icon name="cloud-sun" size={14} />
                  <span>{coords.lat}°, {coords.lon}°</span>
                </div>
              )}
              <div className="weather-temp-display">{weather.temp}°C</div>
              <div className="weather-desc-text">{WMO[weather.code] ?? 'Unknown'}</div>
              <div className="weather-feels">Feels like {weather.feels}°C</div>
              <div className="weather-stats">
                <div className="weather-stat-pill">
                  <span className="weather-stat-label">Humidity</span>
                  <span className="weather-stat-val">{weather.humidity}%</span>
                </div>
                <div className="weather-stat-pill">
                  <span className="weather-stat-label">Wind</span>
                  <span className="weather-stat-val">{weather.wind} km/h</span>
                </div>
              </div>
            </div>

            <div className={`weather-advice${advice.ok ? '' : ' weather-advice--warn'}`}>
              <div className="weather-advice-icon">
                <Icon name={advice.ok ? 'zap' : 'bell'} size={18} />
              </div>
              <div className="weather-advice-text">{advice.text}</div>
            </div>

            <div className="section-heading" style={{ marginTop: 'var(--s5)' }}>Court Suitability</div>
            <div className="court-list">
              {COURTS.map(c => {
                const suitable = c.ok(weather.code, weather.wind)
                return (
                  <div key={c.surface} className="court-row">
                    <span className={`surface-badge surface-badge--${c.surface.toLowerCase()}`}>{c.surface}</span>
                    <span className="court-note">{c.note}</span>
                    <span className={`court-status${suitable ? ' court-status--ok' : ' court-status--bad'}`}>
                      {suitable ? 'Suitable' : 'Not ideal'}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )
      })()}
    </div>
  )
}
