import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from './components/Main'
import setInitialLevelOfGame from './engine/events/setInitialLevelOfGame'
import ErrorScreen from './components/ErrorScreen'
import { disableScrolling } from './commands/disableScrolling'
import { enableScrolling } from './commands/enableScrolling'

// Глобальный флаг, чтобы не создать root повторно при HMR
const W: any = typeof window !== 'undefined' ? window : {}
W.__appRoot ??= null as null | ReturnType<typeof ReactDOM.createRoot>

function parseLevel(search: string): number {
  const raw = new URLSearchParams(search).get('level')
  const n = raw ? parseInt(raw, 10) : 1
  // Подстрой диапазон под свой максимум уровней
  return Number.isFinite(n) && n >= 1 ? n : 1
}

export default function main() {
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Root element not found')

  const root = (W.__appRoot ||= ReactDOM.createRoot(rootElement))

  try {
    const level = parseLevel(window.location.search)
    const ok = setInitialLevelOfGame(level)

    if (ok) {
      disableScrolling() // важно, чтобы была идемпотентной
      root.render(
        <React.StrictMode>
          <Main />
        </React.StrictMode>
      )
    } else {
      root.render(
        <React.StrictMode>
          <ErrorScreen message='Failed to initialize game level' />
        </React.StrictMode>
      )
      // Скролл не трогаем — он и не отключался
    }
  } catch (err) {
    console.error('Error initializing app:', err)
    root.render(
      <React.StrictMode>
        <ErrorScreen message='An error occurred while initializing the game' />
      </React.StrictMode>
    )
    enableScrolling()
  }
}
