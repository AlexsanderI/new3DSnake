import { snakeCONFIG } from '../../../config/snakeConfig/snakeCONFIG'
import { setDistanceFromSnakeToFood } from '../../../engine/events/snakeMovesTowardsFood'
import { getStep, getTimerStep } from '../../../engine/time/timerStepPerLevel'
import {
  getSnakeUnitPosition,
  setSnakeUnitPosition,
} from '../bodyAnimations/snakeBodyProps'
import { getCounterHead, getHeadVerticalStep } from './snakeHeadLocation'
import { MathUtils, Vector3 } from 'three'

const snakeHeadProps = snakeCONFIG.head.head
const snakeJawProps = snakeCONFIG.head.jaw
const snakeTongueProps = snakeCONFIG.head.tongue

const IN_OUT_RATE = 50
const HEAD_ROTATION = 0.66
const JAW_OPEN_ROTATION = -1.3
const JAW_CLOSED_ROTATION = -0.05
const JAW_OPEN_Z = -0.3
const JAW_CLOSED_Z = 0.11
const TONGUE_OPEN_ROTATION = -0.6
const TONGUE_CLOSED_ROTATION = 0
const TONGUE_OPEN_Z = -0.1
const TONGUE_CLOSED_Z = 0.23
const TONGUE_OPEN_Y = 0.1
const TONGUE_CLOSED_Y = 0.35
const APPLE_HIDE_OPEN_PROGRESS = 0.35
const APPLE_HIDE_OPEN_PROGRESS_AT_MAX_SPEED = 0.18
const APPLE_HIDE_MOVE_PROGRESS_AT_MAX_SPEED = 0.65
const MAX_SNAKE_SPEED = 5

export const foodEatenAnimation = (delta: number) => {
  // const [counterHeadX, counterHeadY] = getCounterHead()
  // if (counterHeadX === 0 && counterHeadY === 0) {
  const moveSpeed = getTimerStep()
  const currentStepZ = getHeadVerticalStep()

  const lambda = IN_OUT_RATE * moveSpeed

  const headTarget = currentStepZ > 0 ? HEAD_ROTATION : 0
  snakeHeadProps['rotation-x'] = MathUtils.damp(
    snakeHeadProps['rotation-x'],
    headTarget,
    lambda,
    delta
  )

  const jawRotTarget = currentStepZ > 0 ? JAW_OPEN_ROTATION : JAW_CLOSED_ROTATION
  snakeJawProps['rotation-x'] = MathUtils.damp(
    snakeJawProps['rotation-x'],
    jawRotTarget,
    lambda,
    delta
  )

  const jawPosTarget = currentStepZ > 0 ? JAW_OPEN_Z : JAW_CLOSED_Z
  snakeJawProps.position.z = MathUtils.damp(
    snakeJawProps.position.z,
    jawPosTarget,
    lambda,
    delta
  )
  snakeJawProps.position = new Vector3(
    snakeJawProps.position.x,
    snakeJawProps.position.y,
    snakeJawProps.position.z
  )

  const tongueRotTarget = currentStepZ > 0 ? TONGUE_OPEN_ROTATION : TONGUE_CLOSED_ROTATION
  snakeTongueProps['rotation-x'] = MathUtils.damp(
    snakeTongueProps['rotation-x'],
    tongueRotTarget,
    lambda,
    delta
  )
  const tonguePosTargetZ = currentStepZ > 0 ? TONGUE_OPEN_Z : TONGUE_CLOSED_Z
  snakeTongueProps.position.z = MathUtils.damp(
    snakeTongueProps.position.z,
    tonguePosTargetZ,
    lambda,
    delta
  )
  const tonguePosTargetY = currentStepZ > 0 ? TONGUE_OPEN_Y : TONGUE_CLOSED_Y
  snakeTongueProps.position.y = MathUtils.damp(
    snakeTongueProps.position.y,
    tonguePosTargetY,
    lambda,
    delta
  )
  snakeTongueProps.position = new Vector3(
    snakeTongueProps.position.x,
    snakeTongueProps.position.y,
    snakeTongueProps.position.z
  )
  // }
}

export const closeSnakeMouthOnly = () => {
  snakeHeadProps['rotation-x'] = 0
  setDistanceFromSnakeToFood(2)
  snakeJawProps['rotation-x'] = JAW_CLOSED_ROTATION
  snakeJawProps.position.z = JAW_CLOSED_Z
  snakeJawProps.position = new Vector3(
    snakeJawProps.position.x,
    snakeJawProps.position.y,
    snakeJawProps.position.z
  )
  snakeTongueProps['rotation-x'] = TONGUE_CLOSED_ROTATION
  snakeTongueProps.position.z = TONGUE_CLOSED_Z
  snakeTongueProps.position.y = TONGUE_CLOSED_Y
  snakeTongueProps.position = new Vector3(
    snakeTongueProps.position.x,
    snakeTongueProps.position.y,
    snakeTongueProps.position.z
  )
}

export const closeSnakeMouth = () => {
  snakeHeadProps['rotation-x'] = 0
  const pos = getSnakeUnitPosition().map((positions, index) => {
    if (index === 0) positions[2] = 0
    return positions
  })
  setSnakeUnitPosition(pos)
  setDistanceFromSnakeToFood(2)
  snakeJawProps['rotation-x'] = JAW_CLOSED_ROTATION
  snakeJawProps.position.z = JAW_CLOSED_Z
  snakeJawProps.position = new Vector3(
    snakeJawProps.position.x,
    snakeJawProps.position.y,
    snakeJawProps.position.z
  )
  snakeTongueProps['rotation-x'] = TONGUE_CLOSED_ROTATION
  snakeTongueProps.position.z = TONGUE_CLOSED_Z
  snakeTongueProps.position.y = TONGUE_CLOSED_Y
  snakeTongueProps.position = new Vector3(
    snakeTongueProps.position.x,
    snakeTongueProps.position.y,
    snakeTongueProps.position.z
  )
}

export const isSnakeMouthAtMaxOpen = () => {
  const jawRotationDiff = Math.abs(snakeJawProps['rotation-x'] - JAW_OPEN_ROTATION)
  const jawPositionDiff = Math.abs(snakeJawProps.position.z - JAW_OPEN_Z)

  return jawRotationDiff <= 0.08 && jawPositionDiff <= 0.05
}

export const shouldHideAppleBeforeMaxOpen = () => {
  const requiredOpenProgress =
    getStep() >= MAX_SNAKE_SPEED
      ? APPLE_HIDE_OPEN_PROGRESS_AT_MAX_SPEED
      : APPLE_HIDE_OPEN_PROGRESS
  const jawRotationOpenProgress =
    (snakeJawProps['rotation-x'] - JAW_CLOSED_ROTATION) /
    (JAW_OPEN_ROTATION - JAW_CLOSED_ROTATION)
  const jawPositionOpenProgress =
    (snakeJawProps.position.z - JAW_CLOSED_Z) / (JAW_OPEN_Z - JAW_CLOSED_Z)

  return (
    jawRotationOpenProgress >= requiredOpenProgress &&
    jawPositionOpenProgress >= requiredOpenProgress
  )
}

export const isSnakeOpeningMouthForFoodAtMaxSpeed = () =>
  getStep() >= MAX_SNAKE_SPEED &&
  getHeadVerticalStep() > 0 &&
  shouldHideAppleBeforeMaxOpen()

export const shouldHideAppleBeforeContactAtMaxSpeed = () => {
  const [counterHeadX, counterHeadY] = getCounterHead()
  const moveProgress = Math.max(Math.abs(counterHeadX), Math.abs(counterHeadY))

  return (
    getStep() >= MAX_SNAKE_SPEED &&
    getHeadVerticalStep() > 0 &&
    moveProgress >= APPLE_HIDE_MOVE_PROGRESS_AT_MAX_SPEED
  )
}

export const getSnakeHeadProps = () => snakeHeadProps
export const getSnakeJawProps = () => snakeJawProps
export const getSnakeTongueProps = () => snakeTongueProps
