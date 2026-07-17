import { getObstacles } from '../engine/obstacles/obstaclesPerLevel'
import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { getAllObstacles } from '../engine/obstacles/getAllObstacles'
import { useFrame } from '@react-three/fiber'
import Hedgehog from '../assets/hedgehogModel/hedgehog'
import Mushroom from '../assets/mushroomModel/Mushroom'
import { getField } from '../engine/field/fieldPerLevel'
import { SystemConfig } from '../config/systemConfig'
import { checkTimerWorking } from '../engine/time/isTimer'
import moveObstacles from '../engine/obstacles/moveObstacles'
import Rock from '../assets/rockModel/Rock'
import { checkMistake } from '../engine/lives/isMistake'

let threeCoordX: THREE.Vector3[] = []
let threeCoordY: THREE.Vector3[] = []
let counter = -1
let prevVisualX: number[] = []
let prevVisualY: number[] = []
let nextEngineX: number[] = []
let nextEngineY: number[] = []

const Obstacles: React.FC = () => {
  const gridSize = getField()
  const { xCoord, xStep, yCoord, yStep, fixCoord } = getAllObstacles()

  // локальные состояния шагов для передачи в Hedgehog — будут обновляться в useFrame
  const [xStepState, setXStepState] = useState<number[]>(xStep)
  const [yStepState, setYStepState] = useState<number[]>(yStep)

  const obstaclesRefs = useRef<Record<string, React.RefObject<THREE.Group>>>({})
  const lastXStep = useRef<number[]>([...xStep])
  const lastYStep = useRef<number[]>([...yStep])
  // Создаём стабильные рефы по индексам координат для каждого типа препятствий.
  // Ключи x_0..x_n, y_0..y_n, fix_0..fix_n совпадают с индексами данных.
  const xCount = xCoord.length
  for (let i = 0; i < xCount; i++) {
    const key = `x_${i}`
    if (!obstaclesRefs.current[key])
      obstaclesRefs.current[key] = React.createRef<THREE.Group>()
  }

  const yCount = yCoord.length
  for (let i = 0; i < yCount; i++) {
    const key = `y_${i}`
    if (!obstaclesRefs.current[key])
      obstaclesRefs.current[key] = React.createRef<THREE.Group>()
  }

  const fixCount = fixCoord.length
  for (let i = 0; i < fixCount; i++) {
    const key = `fix_${i}`
    if (!obstaclesRefs.current[key])
      obstaclesRefs.current[key] = React.createRef<THREE.Group>()
  }

  useFrame(() => {
    const shouldAnimateObstacles = checkTimerWorking() || checkMistake()
    const forceMoveByMistake = !checkTimerWorking() && checkMistake()
    // 1. Тик: запускаем движок на границе периода (до инициализации, чтобы в первом кадре не срабатывало)
    if (counter === 0 && shouldAnimateObstacles) {
      // Сохраняем текущие экранные позиции как начало интерполяции
      threeCoordX.forEach((v, i) => {
        prevVisualX[i] = v.x
      })
      threeCoordY.forEach((v, i) => {
        prevVisualY[i] = v.y
      })
      // Шаг движка
      moveObstacles('x', forceMoveByMistake)
      moveObstacles('y', forceMoveByMistake)
      // Читаем новые целевые позиции движка
      const updated = getAllObstacles()
      nextEngineX = updated.xCoord.map((c) => Math.round(c[0] - gridSize / 2) - 1)
      nextEngineY = updated.yCoord.map((c) => Math.round(c[1] - gridSize / 2) - 1)
      // Обновляем направление ежей, сохраняя последнее ненулевое
      const newXSteps = updated.xStep.map((s, i) => {
        if (s !== 0) {
          lastXStep.current[i] = s
          return s
        }
        return lastXStep.current[i] ?? s
      })
      const newYSteps = updated.yStep.map((s, i) => {
        if (s !== 0) {
          lastYStep.current[i] = s
          return s
        }
        return lastYStep.current[i] ?? s
      })
      setXStepState(newXSteps)
      setYStepState(newYSteps)
    }

    // 2. Инициализация на первом кадре
    if (counter === -1) {
      threeCoordX = xCoord.map(
        (coord) =>
          new THREE.Vector3(
            Math.round(coord[0] - gridSize / 2) - 1,
            Math.round(coord[1] - gridSize / 2) - 1,
            0,
          ),
      )
      threeCoordY = yCoord.map(
        (coord) =>
          new THREE.Vector3(
            Math.round(coord[0] - gridSize / 2) - 1,
            Math.round(coord[1] - gridSize / 2) - 1,
            0,
          ),
      )
      prevVisualX = threeCoordX.map((v) => v.x)
      prevVisualY = threeCoordY.map((v) => v.y)
      nextEngineX = [...prevVisualX]
      nextEngineY = [...prevVisualY]
      counter = 0
    }

    // 3. Продвигаем счётчик
    counter += 1 / SystemConfig.FPS
    const tickProgress = counter // захватываем до сброса
    if (shouldAnimateObstacles && counter >= 1) counter = 0

    // 4. Плавная интерполяция prevVisual → nextEngine
    if (threeCoordX.length > 0) {
      const t = Math.min(tickProgress, 1)
      threeCoordX.forEach((vec, i) => {
        if (prevVisualX[i] !== undefined && nextEngineX[i] !== undefined)
          vec.x = prevVisualX[i] + (nextEngineX[i] - prevVisualX[i]) * t
      })
      threeCoordY.forEach((vec, i) => {
        if (prevVisualY[i] !== undefined && nextEngineY[i] !== undefined)
          vec.y = prevVisualY[i] + (nextEngineY[i] - prevVisualY[i]) * t
      })
    }

    // 5. Передаём позиции в рефы
    Object.entries(obstaclesRefs.current).forEach(([key, ref]) => {
      const [obsType, indexStr] = key.split('_')
      const index = parseInt(indexStr, 10)
      if (obsType === 'fix') return
      const vec = obsType === 'x' ? threeCoordX[index] : threeCoordY[index]
      if (!vec) return
      ref.current?.position.set(vec.x, vec.y, 0)
    })
  })

  return (
    <>
      {Object.entries(obstaclesRefs.current || {}).map(([key, ref]) => {
        const [obsType, indexStr] = key.split('_')
        const index = parseInt(indexStr, 10)
        const directionArray = obsType === 'x' ? xStepState : yStepState

        // Грибы — неподвижные препятствия (fix)
        if (obsType === 'fix') {
          const fixCoords = fixCoord[index]
          if (!fixCoords) return null
          const fx = Math.round(fixCoords[0] - gridSize / 2) - 1
          const fy = Math.round(fixCoords[1] - gridSize / 2) - 1

          // Определяем тип fix-препятствия из массива obstacles (fix / fix-M / fix-R)
          const allObstacleTypes = getObstacles()
          const fixTypes = allObstacleTypes.filter((o) => o.substring(0, 3) === 'fix')
          const obstacleType = fixTypes[index] ?? 'fix'
          const isMushroom = obstacleType === 'fix-M' || obstacleType === 'fix'
          const isRock = obstacleType === 'fix-R'

          if (isMushroom) {
            return (
              <group key={key} position={[fx, fy, 0]} scale={[0.06, 0.06, 0.06]}>
                <Mushroom seed={index + 1000} />
              </group>
            )
          }
          if (isRock) {
            return (
              <group key={key} position={[fx, fy, -0.3]} scale={[1.3, 1.3, 1.3]}>
                <Rock seed={index + 1000} />
              </group>
            )
          }
        }

        // Ежи — движущиеся препятствия (x, y)
        return (
          <group key={key} ref={ref} scale={[0.65, 0.65, 0.65]}>
            <Hedgehog direction={directionArray} index={index} line={obsType} />
          </group>
        )
      })}
    </>
  )
}
export default Obstacles
