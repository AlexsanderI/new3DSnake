import { useEffect, useRef, useState } from 'react'
import { Scene } from './Scene'
import renderInfo from '../engine/render/renderInfo'
import { useFrame } from '@react-three/fiber'
import setLoop from '../engine/time/setLoop'
import { useMenuStore } from '../store/menuStore'
import { getInterruptGame } from '../engine/events/interruptGameEvent'
import {
  clearGameFinishTimeout,
  clearGameFinishTimeoutOnLifecycleReset,
  scheduleGameFinishTimeout,
  type GameFinishTimeoutRef,
} from './gameFinishTimeout'
import { useLifecycleState } from '../store/sessionLifecycleStore'
import { productionSessionCommands } from '../engine/session/productionSession'
import { registerLifecycleKeyboardListeners } from '../engine/session/lifecycleKeyboardListeners'

export const Game = () => {
  const isVisible = useMenuStore((state) => state.isVisible)
  const lifecycleState = useLifecycleState()
  const [showScene, setShowScene] = useState(true)
  const finishTimeoutRef = useRef<GameFinishTimeoutRef['current']>(null)

  useEffect(() => {
    if (!isVisible && lifecycleState === 'main-menu') {
      productionSessionCommands.startSession()
    }
  }, [isVisible, lifecycleState])

  useEffect(() => registerLifecycleKeyboardListeners(document, lifecycleState), [
    lifecycleState,
  ])

  useEffect(() => {
    clearGameFinishTimeoutOnLifecycleReset(finishTimeoutRef, lifecycleState)
  }, [lifecycleState])

  useEffect(() => {
    return () => {
      clearGameFinishTimeout(finishTimeoutRef)
    }
  }, [])

  useFrame((_, delta) => {
    setLoop(delta)
    renderInfo()

    if (getInterruptGame() && finishTimeoutRef.current === null) {
      scheduleGameFinishTimeout(finishTimeoutRef, () => {
        setShowScene(false)
      })
    }

    if (!getInterruptGame() && !showScene) {
      setShowScene(true)
    }
  }, -100)

  return showScene && <Scene />
}
