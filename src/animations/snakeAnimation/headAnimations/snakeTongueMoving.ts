import { SnakeSteps } from '../../../types/animationTypes'
import { snakeCONFIG } from '../../../config/snakeConfig/snakeCONFIG'
import { MathUtils, Vector3 } from 'three'

const tongueProps = snakeCONFIG.head.tongue
const BASE_Y = tongueProps.position.y
const EXTEND = 0.15
const WIGGLE_ANGLE = 0.3
let phase = 0

export const snakeTongueMoving = (steps: SnakeSteps, delta: number) => {
  const isMoving = steps.currentStepX !== 0 || steps.currentStepY !== 0
  const lambda = 50

  if (isMoving) {
    phase += delta * 5
    const extendFactor = (Math.sin(phase) + 1) / 2
    const targetY = BASE_Y + EXTEND * extendFactor
    tongueProps.position.y = MathUtils.damp(
      tongueProps.position.y,
      targetY,
      lambda,
      delta
    )
    tongueProps['rotation-y'] = Math.sin(phase * 10) * WIGGLE_ANGLE
  } else {
    tongueProps.position.y = MathUtils.damp(tongueProps.position.y, BASE_Y, lambda, delta)
    tongueProps['rotation-y'] = MathUtils.damp(
      tongueProps['rotation-y'] || 0,
      0,
      lambda,
      delta
    )
    phase = 0
  }

  tongueProps.position = new Vector3(
    tongueProps.position.x,
    tongueProps.position.y,
    tongueProps.position.z
  )
}

export const getSnakeTongueProps = () => tongueProps
