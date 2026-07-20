export type SessionEffectHandle = {
  cleanup: () => void
}

type TimerHandle = ReturnType<typeof setTimeout>

let sessionGeneration = 0
const cleanupCallbacks = new Set<() => void>()

function addCleanup(cleanup: () => void): SessionEffectHandle {
  let active = true
  const wrappedCleanup = () => {
    if (!active) return
    active = false
    cleanupCallbacks.delete(wrappedCleanup)
    cleanup()
  }

  cleanupCallbacks.add(wrappedCleanup)

  return {
    cleanup: wrappedCleanup,
  }
}

export function getSessionGeneration(): number {
  return sessionGeneration
}

export function isCurrentSessionGeneration(generation: number): boolean {
  return generation === sessionGeneration
}

export function beginSessionGeneration(): number {
  cleanupSessionEffects()
  sessionGeneration += 1
  return sessionGeneration
}

export function registerSessionTimeout(
  callback: () => void,
  delayMs: number
): SessionEffectHandle {
  const generation = sessionGeneration
  let handle: SessionEffectHandle
  const timeoutId: TimerHandle = setTimeout(() => {
    handle.cleanup()
    if (!isCurrentSessionGeneration(generation)) return
    callback()
  }, delayMs)

  handle = addCleanup(() => clearTimeout(timeoutId))
  return handle
}

export function registerSessionInterval(
  callback: () => void,
  delayMs: number
): SessionEffectHandle {
  const generation = sessionGeneration
  const intervalId: TimerHandle = setInterval(() => {
    if (!isCurrentSessionGeneration(generation)) return
    callback()
  }, delayMs)

  return addCleanup(() => clearInterval(intervalId))
}

export function cleanupSessionEffects(): void {
  const cleanups = [...cleanupCallbacks]
  cleanups.forEach((cleanup) => cleanup())
}

export function getSessionEffectCount(): number {
  return cleanupCallbacks.size
}
