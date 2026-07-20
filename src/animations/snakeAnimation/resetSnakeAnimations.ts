import { resetSnakeBodyLocation } from './bodyAnimations/snakeBodyLocation'
import { resetSnakeBodyMovingState } from './bodyAnimations/snakeBodyMoving'
import { resetSnakeBodyProps } from './bodyAnimations/snakeBodyProps'
import { resetSnakeDiff } from './bodyAnimations/snakeDiff'
import { resetSnakeHeadLocation } from './headAnimations/snakeHeadLocation'
import { resetSnakeHeadMovingState } from './headAnimations/snakeHeadMoving'
import { resetSnakeHeadProps } from './headAnimations/snakeHeadProps'
import { closeSnakeMouthOnly } from './headAnimations/foodEatenAnimation'
import { resetSnakeTongueMoving } from './headAnimations/snakeTongueMoving'
import { resetSnakePreviousStepsArray } from './snakeAnimation'
import { resetSnakeSpeed } from './snakeSpeedSetting'
import { resetSnakeTurnAround } from './snakeStepSetting'
import { resetTailAnimationState } from './tailAnimations/snakeTailAnimationSet'

export function resetSnakeAnimations(): void {
  resetSnakePreviousStepsArray()
  resetSnakeTurnAround()
  resetSnakeSpeed()
  resetSnakeHeadLocation()
  resetSnakeHeadMovingState()
  resetSnakeHeadProps()
  closeSnakeMouthOnly()
  resetSnakeTongueMoving()
  resetSnakeBodyMovingState()
  resetSnakeBodyLocation()
  resetSnakeDiff()
  resetSnakeBodyProps()
  resetTailAnimationState()
}
