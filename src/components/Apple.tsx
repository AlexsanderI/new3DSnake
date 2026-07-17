import * as React from 'react'
import { Material, Object3D } from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { appleCONFIG } from '../config/appleConfig'
import { GLTFResult } from '../types/threeTypes'
import { AppleConfig } from '../types/appleTypes'
import { useApplePosition } from '../hooks/useApplePosition'
import { useShadowSetup } from '../hooks/useShadowSetup'
import ErrorScreen from './ErrorScreen'
import Spinner from './Spinner'
import { getFoodEaten } from '../engine/events/snakeCatchesFoodEvent'
import { getStep } from '../engine/time/timerStepPerLevel'
import {
  closeSnakeMouthOnly,
  shouldHideAppleBeforeContactAtMaxSpeed,
  shouldHideAppleBeforeMaxOpen,
} from '../animations/snakeAnimation/headAnimations/foodEatenAnimation'

const COUNTER_RESET_VALUE = 1000000 // Предотвращает переполнение счетчика
const DEBUG_MODE = false
const FORCE_SPINNER = false
const FORCE_LOAD_ERROR = false
const FORCE_ERROR = false
const HIDE_APPLE_IMMEDIATELY_SPEED = 5
const HIDE_APPLE_FRAMES_AFTER_EAT = 2

/**
 * Компонент Apple отображает 3D-модель яблока,
 * получая его позицию на поле из игрового движка.
 */
const Apple: React.FC = () => {
  // 🟥 Если принудительная ошибка активна — сразу рендерим ErrorScreen
  if (DEBUG_MODE && FORCE_ERROR && !FORCE_SPINNER) {
    console.log('Принудительная отладочная ошибка (FORCE_ERROR)')

    return <ErrorScreen message='Принудительная отладочная ошибка (FORCE_ERROR)' />
  }

  const [loadError, setLoadError] = React.useState<Error | null>(null)
  const gltf = useGLTF('/apple.glb', undefined, undefined, (error) => {
    console.error('Ошибка загрузки модели яблока:', error)
    setLoadError(new Error('Не удалось загрузить модель яблока'))
  }) as GLTFResult
  const { zLocation, scale, FRAME_SKIP } = appleCONFIG as AppleConfig
  const { position, updatePosition } = useApplePosition(zLocation)
  const [renderPosition, setRenderPosition] = React.useState<typeof position>(null)
  const appleScene = React.useMemo(() => {
    const scene = gltf.scene.clone(true)
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((material: Material) => material.clone())
        } else {
          child.material = child.material.clone()
        }
      }
    })

    return scene
  }, [gltf.scene])
  useShadowSetup(appleScene)
  const counterRef = React.useRef<Object3D | null>(null)
  const eatenRef = React.useRef(false)
  const hideFramesRef = React.useRef(0)
  const mouthClosedRef = React.useRef(false)
  const preHideRef = React.useRef(false)
  let scaleArray = React.useMemo(() => [scale, scale, scale] as const, [scale])

  useFrame(() => {
    try {
      const shouldPreHideAtMaxSpeed = shouldHideAppleBeforeContactAtMaxSpeed()
      const foodWasEatenThisFrame = getFoodEaten()

      if (foodWasEatenThisFrame && counterRef.current) {
        eatenRef.current = true
        if (getStep() < HIDE_APPLE_IMMEDIATELY_SPEED) {
          hideFramesRef.current = HIDE_APPLE_FRAMES_AFTER_EAT
          counterRef.current.visible = false
          return
        }

        if (getStep() >= HIDE_APPLE_IMMEDIATELY_SPEED) {
          hideFramesRef.current = HIDE_APPLE_FRAMES_AFTER_EAT
          counterRef.current.visible = false
          if (!mouthClosedRef.current) {
            closeSnakeMouthOnly()
            mouthClosedRef.current = true
          }
          return
        }
      }

      // counterRef.current = (counterRef.current + 1) % COUNTER_RESET_VALUE
      // if (counterRef.current % FRAME_SKIP !== 0) return
      updatePosition()

      if (hideFramesRef.current > 0) {
        hideFramesRef.current -= 1
        if (counterRef.current) counterRef.current.visible = false
        if (hideFramesRef.current === 0) {
          eatenRef.current = false
          mouthClosedRef.current = false
          preHideRef.current = false
          if (counterRef.current) {
            counterRef.current.visible = true
            counterRef.current.scale.set(scale, scale, scale)
          }
        }
        return
      }

      if (!eatenRef.current && shouldPreHideAtMaxSpeed && counterRef.current) {
        preHideRef.current = true
        counterRef.current.visible = false
        return
      }

      if (eatenRef.current && counterRef.current) {
        const shouldHideNow =
          getStep() >= HIDE_APPLE_IMMEDIATELY_SPEED
            ? true
            : shouldHideAppleBeforeMaxOpen()

        if (shouldHideNow) {
          if (hideFramesRef.current === 0) {
            hideFramesRef.current = HIDE_APPLE_FRAMES_AFTER_EAT
          }
          counterRef.current.visible = false
          if (!mouthClosedRef.current) {
            closeSnakeMouthOnly()
            mouthClosedRef.current = true
          }
        } else {
          counterRef.current.visible = true
        }
      }
    } catch (error) {
      console.error('Ошибка обновления позиции яблока:', error)
      setLoadError(error as Error)
    }
  }, -10)

  React.useEffect(() => {
    if (!position) return

    setRenderPosition(position)
    if (counterRef.current) {
      counterRef.current.position.set(position[0], position[1], position[2])
      if (!eatenRef.current && hideFramesRef.current === 0 && !preHideRef.current) {
        counterRef.current.visible = true
        counterRef.current.scale.set(scale, scale, scale)
      }
    }
  }, [position, scale])

  React.useEffect(() => {
    return () => useGLTF.clear('/apple.glb')
  }, [])

  // 🟥 Если произошла реальная ошибка — показываем её
  if (loadError) {
    return <ErrorScreen message={loadError.message} />
  }

  // ⏳ Показываем спиннер
  if (!appleScene || (DEBUG_MODE && FORCE_SPINNER)) return <Spinner />
  if (!appleScene) return <Spinner />
  if (!renderPosition) return null

  return (
    <primitive
      ref={counterRef}
      object={appleScene}
      position={renderPosition}
      scale={scaleArray}
    />
  )
}

useGLTF.preload('/apple.glb')

export default React.memo(Apple)
