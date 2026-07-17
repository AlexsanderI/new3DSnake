import { SnakeSteps } from '../../../types/animationTypes'
import { getSnakeUnitPosition, setSnakeUnitPosition } from './snakeBodyProps'
import { getDiff } from './snakeDiff'
import { getAmountOfFood } from '../../../engine/food/amountOfFoodPerLevel'
import { getCounterHead, getHeadVerticalStep } from '../headAnimations/snakeHeadLocation'
import { SystemConfig } from '../../../config/systemConfig'
import { getTimerStep } from '../../../engine/time/timerStepPerLevel'
import { getFoodEaten } from '../../../engine/events/snakeCatchesFoodEvent'
import { MathUtils } from 'three'
import { getField } from '../../../engine/field/fieldPerLevel'
// import * as TURN from './snakeBodyTurnaround'
// import { getSnakeBodyCoord } from '../../../engine/snake/snake'

let counterUnits: number[][] = []
// let counterTurnItem: number = 0
// let counterPauseDuring: number = 0

/* Parameters controlling transverse wave for the snake body */

const WAVE_FREQUENCY = 2 * Math.PI
const WAVE_PHASE_STEP = Math.PI / 4
let waveTime = 0
let eatingTime = 0
/*----------------------------------------------------------*/
// const MOVE_PAUSE = 10
// let pause = 1
// let stopPause = true

export const setCounterUnits = () => {
  for (let i = 0; i < getAmountOfFood() + 1; i++) counterUnits.push([0, 0])
}

export const getCounterUnits = () => counterUnits

// function easeOutCubic(t: number) {
//   return 1 - Math.pow(1 - t, 3)
// }

let moveSpeed = 1
export const snakeBodyMoving = (steps: SnakeSteps[], delta: number) => {
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0) {
    moveSpeed = getTimerStep()
    // stopPause = false
    // if (TURN.getTurnItemNumber() > 0) {
    //   counterTurnItem = TURN.getTurnItemNumber()
    // }
  }
  const diffZ = getHeadVerticalStep()
  const WAVE_AMPLITUDE = moveSpeed / 200
  waveTime += delta * moveSpeed
  // eatingTime += delta
  // console.log(TURN.getTurnItemNumber())

  // if (TURN.getTurnItemNumber() > 0 && !stopPause)
  //   if (counterPauseDuring >= MOVE_PAUSE) {
  //     counterPauseDuring = -1
  //     stopPause = true
  //   } else {
  //     counterPauseDuring++
  //     stopPause = false
  //   }

  // console.log(counterPauseDuring)

  const pos = getSnakeUnitPosition().map((positions, index) => {
    const diff = getDiff()[index]
    positions[0] += (diff.diffX * moveSpeed) / SystemConfig.FPS
    positions[1] += (diff.diffY * moveSpeed) / SystemConfig.FPS
    // if (index === 0) positions[2] += (diffZ * moveSpeed) / SystemConfig.FPS / 1.3
    if (index === 0) {
      const targetZ = diffZ > 0 ? 0.5 : 0
      positions[2] = MathUtils.damp(positions[2], targetZ, 5, delta)
    }
    /*-------------------------------------------------*/
    if (index != 0) {
      const perpX = -diff.diffY
      const perpY = diff.diffX
      const phase = waveTime + index * WAVE_PHASE_STEP
      const offset = Math.sin(phase * WAVE_FREQUENCY) * WAVE_AMPLITUDE
      positions[0] += perpX * offset
      positions[1] += perpY * offset
    }
    /*----------------------------------------------------*/
    if (counterHeadX === 0 && counterHeadY === 0) {
      positions[0] = Math.round(positions[0])
      positions[1] = Math.round(positions[1])
      // if (index === 0) positions[2] = Math.round(positions[2])
    }
    const fieldBoundary = Math.round(getField() / 2) - 1
    const minBound = -fieldBoundary
    const maxBound = fieldBoundary
    positions[0] = Math.max(minBound, Math.min(maxBound, positions[0]))
    positions[1] = Math.max(minBound, Math.min(maxBound, positions[1]))

    if (index !== 0) positions[2] = 0
    if (getFoodEaten()) eatingTime = 0
    return positions
  })

  // if (counterHeadX === 0 && counterHeadY === 0 && counterTurnItem > 0) {
  //   counterTurnItem =
  //     counterTurnItem === getSnakeBodyCoord().length - 2 ? 0 : counterTurnItem + 1
  //   TURN.setTurnItemNumber(counterTurnItem)
  // }

  setSnakeUnitPosition(pos)
}
