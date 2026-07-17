import { SnakeSteps } from '../../../types/animationTypes'
import * as PROPS from './snakeHeadProps'

// export const snakeHeadTurnaround = (steps: SnakeSteps) => {
//   const { previousStepX, previousStepY, currentStepX, currentStepY } = steps
//   const rotationHead = PROPS.getRotationHead()
//   if (previousStepX === 0 && currentStepX === 1) rotationHead[2] = 11
//   if (previousStepX === 0 && currentStepX === -1) rotationHead[2] = 33
//   if (previousStepY === 0 && currentStepY === -1) rotationHead[2] = 22
//   if (previousStepY === 0 && currentStepY === 1) rotationHead[2] = 0
//   PROPS.setRotationHead(rotationHead)
// }

export const snakeHeadTurnaround = (turn: string) => {
  const rotationHead = PROPS.getRotationHead()
  if (turn === 'right') rotationHead[2] = 11
  if (turn === 'left') rotationHead[2] = 33
  if (turn === 'down') rotationHead[2] = 22
  if (turn === 'up') rotationHead[2] = 0

  return rotationHead[2]

  //PROPS.setRotationHead(rotationHead)
}
