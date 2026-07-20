import { useSyncExternalStore } from 'react'
import { productionSessionCommands } from '../engine/session/productionSession'
import type { LifecycleState } from '../engine/session/lifecycleController'

export function getLifecycleState(): LifecycleState {
  return productionSessionCommands.getState()
}

export function subscribeLifecycle(
  onStoreChange: () => void,
): () => void {
  return productionSessionCommands.subscribe(() => {
    onStoreChange()
  })
}

export function useLifecycleState(): LifecycleState {
  return useSyncExternalStore(
    subscribeLifecycle,
    getLifecycleState,
    getLifecycleState,
  )
}
