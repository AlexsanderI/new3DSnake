import { useEffect, useRef, useState } from 'react'
import { Scene } from './Scene'
import renderInfo from '../engine/render/renderInfo'
import { useFrame } from '@react-three/fiber'
import setLoop from '../engine/time/setLoop'
import { useMenuStore } from '../store/menuStore'
import keyboardEvents from '../engine/events/keyboardEvents'
import { keyboardPauseEvent } from '../engine/events/pauseEvent'
import { getInterruptGame } from '../engine/events/interruptGameEvent'

const SCENE_FINISH_DELAY_MS = 500

export const Game = () => {
  const isVisible = useMenuStore((state) => state.isVisible)
  const titleMenu = useMenuStore((state) => state.titleMenu)
  const [showScene, setShowScene] = useState(true)
  const finishTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    document.removeEventListener('keydown', keyboardEvents)
    document.removeEventListener('keydown', keyboardPauseEvent)

    if (isVisible && titleMenu === 'Pause') {
      document.addEventListener('keydown', keyboardPauseEvent)
    } else if (!isVisible) {
      document.addEventListener('keydown', keyboardEvents)
    }

    return () => {
      document.removeEventListener('keydown', keyboardEvents)
      document.removeEventListener('keydown', keyboardPauseEvent)
    }
  }, [isVisible, titleMenu])

  useEffect(() => {
    return () => {
      if (finishTimeoutRef.current !== null) {
        window.clearTimeout(finishTimeoutRef.current)
      }
    }
  }, [])

  useFrame((_, delta) => {
    setLoop(delta)
    renderInfo()

    if (getInterruptGame() && finishTimeoutRef.current === null) {
      finishTimeoutRef.current = window.setTimeout(() => {
        setShowScene(false)
      }, SCENE_FINISH_DELAY_MS)
    }

    if (!getInterruptGame() && !showScene) {
      setShowScene(true)
    }
  }, -100)

  return showScene && <Scene />
}
