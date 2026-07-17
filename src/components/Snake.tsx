import React, { createRef, RefObject, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import SnakeHead from '../assets/snakeModel/snakeHead/SnakeHead'
import SnakeTail from '../assets/snakeModel/snakeTail/SnakeTail'
import { snakeAnimation } from '../animations/snakeAnimation/snakeAnimation'
import { getSnakeBodyCoord } from '../engine/snake/snake'
import SnakeBodyUnit from '../assets/snakeModel/snakeBody/snakeBodyUnit'
import { getAmountOfFood } from '../engine/food/amountOfFoodPerLevel'
import * as U from '../animations/snakeAnimation/bodyAnimations/snakeBodyProps'
import SnakeJaw from '../assets/snakeModel/snakeHead/snakeJaw/SnakeJaw'
import { snakeHeadTurnaround } from '../animations/snakeAnimation/headAnimations/snakeHeadTurnaround'
import { getNewMoveDirection } from '../engine/events/changeDirectionEvent'
import checkTimerStep from '../engine/time/checkTimerStep'
import { checkTimerWorking } from '../engine/time/isTimer'
import { checkMistake } from '../engine/lives/isMistake'

/**
 * Компонент Snake рендерит 3D-модель змеи, состоящую из головы, тела и хвоста.
 */
const Snake = (): JSX.Element => {
  const snakeMaxLength = getAmountOfFood() + 1
  const [snakeCurrentLength, setSnakeCurrentLength] = useState<number>(3)
  const [snakeSeparate, setSnakeSeparate] = useState<number[]>(
    Array(snakeMaxLength).fill(1),
  )
  const snakeRefs = useRef<Record<string, RefObject<THREE.Group>>>({})

  const getVisibleSnakeUnits = (bodyLength: number, maxLength: number): number[] =>
    Array.from({ length: maxLength }, (_, index) => (index > bodyLength - 3 ? 0 : 1))

  const getSnakeRef = (key: string): RefObject<THREE.Group> => {
    if (!snakeRefs.current[key]) snakeRefs.current[key] = createRef<THREE.Group>()
    return snakeRefs.current[key]
  }

  const headRef = getSnakeRef('headRef')
  const tailRef = getSnakeRef('tailRef')

  useEffect(() => {
    const currentBodyLength = getSnakeBodyCoord().length
    setSnakeCurrentLength(currentBodyLength)
    setSnakeSeparate(getVisibleSnakeUnits(currentBodyLength, snakeMaxLength))
  }, [snakeMaxLength])

  useFrame((_, delta) => {
    snakeAnimation(delta)
    const currentBodyLength = getSnakeBodyCoord().length
    const updatedSnake = getVisibleSnakeUnits(currentBodyLength, snakeMaxLength)

    setSnakeSeparate(updatedSnake)
    if (snakeCurrentLength !== currentBodyLength) {
      setSnakeCurrentLength(currentBodyLength)
    }
    for (const key in snakeRefs.current) {
      if (Object.prototype.hasOwnProperty.call(snakeRefs.current, key)) {
        if (key === 'headRef') {
          snakeRefs.current['headRef'].current?.position.set(
            U.getSnakeUnitPosition()[0][0],
            U.getSnakeUnitPosition()[0][1],
            U.getSnakeUnitPosition()[0][2],
          )
          // console.log('Snake', getIsDistraintContact())
          let isStop = checkTimerStep() ? true : false
          const shouldTurnOnForbiddenStop = !checkTimerWorking() && checkMistake()

          let rotationZ = shouldTurnOnForbiddenStop
            ? snakeHeadTurnaround(getNewMoveDirection())
            : U.getSnakeUnitRotation()[0]?.[2]
          // let rotationZ =
          //   checkTimerWorking() && checkMistake()
          //     ? snakeHeadTurnaround(getNewMoveDirection())
          //     : U.getSnakeUnitRotation()[0]?.[2]

          snakeRefs.current['headRef'].current?.rotation.set(0, 0, rotationZ)

          if (isStop && rotationZ !== U.getSnakeUnitRotation()[0]?.[2]) {
            rotationZ = U.getSnakeUnitRotation()[0]?.[2]
            isStop = false
          }
          // console.log(rotationZ, U.getSnakeUnitRotation()[0]?.[2])
        }
        const index = Number(key.replace('bodyUnitRef_', ''))
        if (key === 'tailRef') {
          snakeRefs.current['tailRef'].current?.position.set(
            U.getSnakeUnitPosition()[snakeCurrentLength - 2][0],
            U.getSnakeUnitPosition()[snakeCurrentLength - 2][1],
            U.getSnakeUnitPosition()[snakeCurrentLength - 2][2],
          )
          snakeRefs.current['tailRef'].current?.rotation.set(
            0,
            0,
            U.getSnakeUnitRotation()[snakeCurrentLength - 2][2],
          )
          snakeRefs.current['tailRef'].current?.scale.set(
            0.65 + 0.35 * (1 - (snakeCurrentLength - 2) / getSnakeBodyCoord().length),
            0.65 + 0.35 * (1 - (snakeCurrentLength - 2) / getSnakeBodyCoord().length),
            0.65 + 0.35 * (1 - (snakeCurrentLength - 2) / getSnakeBodyCoord().length),
          )
        }

        if (key.includes('bodyUnitRef_')) {
          if (index < snakeCurrentLength - 2) {
            snakeRefs.current[`bodyUnitRef_${index}`].current?.position.set(
              U.getSnakeUnitPosition()[index][0],
              U.getSnakeUnitPosition()[index][1],
              U.getSnakeUnitPosition()[index][2],
            )
            snakeRefs.current[`bodyUnitRef_${index}`].current?.rotation.set(
              0,
              0,
              U.getSnakeUnitRotation()[index][2],
            )
            snakeRefs.current[`bodyUnitRef_${index}`].current?.scale.set(
              0.65 +
                (0.35 * (getSnakeBodyCoord().length - index)) /
                  getSnakeBodyCoord().length,
              0.65 +
                (0.35 * (getSnakeBodyCoord().length - index)) /
                  getSnakeBodyCoord().length,
              0.65 +
                (0.35 * (getSnakeBodyCoord().length - index)) /
                  getSnakeBodyCoord().length,
            )
          }
        }
      }
    }
  }, -20)

  return (
    <group>
      {snakeSeparate.map((ref, index) => {
        if (index === 0) {
          return (
            <group key={index} ref={headRef}>
              <SnakeHead />
              <SnakeJaw />
            </group>
          )
        } else if (index < snakeMaxLength - 1) {
          return (
            ref === 1 && (
              <group key={index} ref={getSnakeRef(`bodyUnitRef_${index}`)}>
                <SnakeBodyUnit
                  right={-(index % 2) * 1.57}
                  left={3.14 - (index % 2) * 1.57}
                />
              </group>
            )
          )
        } else if (index === snakeMaxLength - 1) {
          return (
            <group key={index} ref={tailRef}>
              <SnakeTail />
            </group>
          )
        } else {
          return null
        }
      })}
    </group>
  )
}

export default React.memo(Snake)
