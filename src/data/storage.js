import { useState } from 'react'

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : (typeof initial === 'function' ? initial() : initial)
    } catch {
      return typeof initial === 'function' ? initial() : initial
    }
  })

  function update(next) {
    setValue(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* quota/private */ }
  }

  return [value, update]
}
