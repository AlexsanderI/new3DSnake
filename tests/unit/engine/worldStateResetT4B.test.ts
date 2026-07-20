import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'

import {
  getObstacles,
  resetObstaclesPerLevel,
  setObstacles,
} from '../../../src/engine/obstacles/obstaclesPerLevel'
import {
  getObstaclesStepX,
  getObstaclesX,
  getObstaclesXCoord,
  setObstaclesStepX,
  setObstaclesXCoord,
} from '../../../src/engine/obstacles/obstaclesX'
import {
  getObstaclesStepY,
  getObstaclesY,
  getObstaclesYCoord,
  setObstaclesStepY,
  setObstaclesYCoord,
} from '../../../src/engine/obstacles/obstaclesY'
import {
  getObstaclesFix,
  getObstaclesFixCoord,
  setObstaclesFixCoord,
} from '../../../src/engine/obstacles/obstaclesFix'
import {
  getObstacleSpeed,
  obstacleSpeedCounter,
} from '../../../src/engine/obstacles/obstacleSpeed'
import {
  getCachedCollidingPositions,
  setCachedCollidingPositions,
} from '../../../src/engine/obstacles/setObstacleStep'
import {
  getPreviousObstacleStepsX,
  getPreviousObstacleStepsY,
  getOscillatingStationaryX,
  getOscillatingStationaryY,
  setObstacleMovementHistory,
} from '../../../src/engine/obstacles/moveObstacles'
import { resetObstacles } from '../../../src/engine/obstacles/resetObstacles'
import {
  getObstacleVisualStateSnapshot,
  resetObstacleVisualState,
  setObstacleVisualState,
} from '../../../src/components/obstacleVisualState'
import {
  getSnakePreviousStepsArray,
  resetSnakePreviousStepsArray,
  setSnakePreviousStepsArray,
} from '../../../src/animations/snakeAnimation/snakeAnimation'
import {
  getSnakeTurnAround,
  resetSnakeTurnAround,
  setSnakeTurnAround,
} from '../../../src/animations/snakeAnimation/snakeStepSetting'
import {
  changeSnakeSpeed,
  getSnakeSpeed,
  resetSnakeSpeed,
} from '../../../src/animations/snakeAnimation/snakeSpeedSetting'
import {
  getCounterHead,
  getHeadVerticalStep,
  resetSnakeHeadLocation,
  setSnakeHeadLocationState,
} from '../../../src/animations/snakeAnimation/headAnimations/snakeHeadLocation'
import {
  getPositionHead,
  getRotationHead,
  resetSnakeHeadProps,
  setPositionHead,
  setRotationHead,
} from '../../../src/animations/snakeAnimation/headAnimations/snakeHeadProps'
import {
  getSnakeBodyMovementState,
  getCounterUnits,
  resetSnakeBodyMovingState,
  setCounterUnitsExact,
  setSnakeBodyMovementState,
} from '../../../src/animations/snakeAnimation/bodyAnimations/snakeBodyMoving'
import {
  getSnakeBodyLocation,
  resetSnakeBodyLocation,
  setSnakeBodyLocation,
} from '../../../src/animations/snakeAnimation/bodyAnimations/snakeBodyLocation'
import {
  getDiff,
  getPreviousDiff,
  resetSnakeDiff,
  setDiff,
} from '../../../src/animations/snakeAnimation/bodyAnimations/snakeDiff'
import {
  getSnakeUnitPosition,
  getSnakeUnitRotation,
  getSnakeUnitScale,
  resetSnakeBodyProps,
  setSnakeUnitPosition,
  setSnakeUnitRotation,
  setSnakeUnitScale,
} from '../../../src/animations/snakeAnimation/bodyAnimations/snakeBodyProps'
import {
  getIsTailAnimating,
  getTailAnimatingCounter,
  getTailAnimatingQueue,
  resetTailAnimationState,
  setIsTailAnimating,
  setTailAnimationCounter,
  setTailAnimatingQueueExact,
} from '../../../src/animations/snakeAnimation/tailAnimations/snakeTailAnimationSet'
import { resetSnakeAnimations } from '../../../src/animations/snakeAnimation/resetSnakeAnimations'
import {
  checkRenderCompleting,
  renderComplete,
  resetRender,
} from '../../../src/engine/render/isRender'
import { resetRenderInfo } from '../../../src/engine/render/renderInfo'

describe('T4B obstacle, animation, and render reset APIs', () => {
  it('resets obstacle engine and visual state idempotently without level JSON', () => {
    resetObstacles()
    resetObstacleVisualState()

    setObstacles(['x', 'y', 'fix-M'])
    setObstaclesXCoord([
      [2, 3],
      [4, 5],
    ])
    setObstaclesYCoord([[6, 7]])
    setObstaclesFixCoord([[8, 9]])
    setObstaclesStepX([1, -1])
    setObstaclesStepY([-1])
    obstacleSpeedCounter()
    obstacleSpeedCounter()
    setCachedCollidingPositions([[1, 1]])
    setObstacleMovementHistory({
      previousX: [1, -1],
      previousY: [-1],
      stationaryX: [[2, 3]],
      stationaryY: [[6, 7]],
    })
    setObstacleVisualState({
      threeCoordX: [new Vector3(1, 2, 0)],
      threeCoordY: [new Vector3(3, 4, 0)],
      counter: 0.5,
      prevVisualX: [1],
      prevVisualY: [3],
      nextEngineX: [2],
      nextEngineY: [4],
    })

    resetObstacles()
    resetObstacles()
    resetObstacleVisualState()
    resetObstacleVisualState()

    expect(getObstacles()).toEqual([])
    expect(getObstaclesX()).toEqual([])
    expect(getObstaclesY()).toEqual([])
    expect(getObstaclesFix()).toEqual([])
    expect(getObstaclesXCoord()).toEqual([])
    expect(getObstaclesYCoord()).toEqual([])
    expect(getObstaclesFixCoord()).toEqual([])
    expect(getObstaclesStepX()).toEqual([])
    expect(getObstaclesStepY()).toEqual([])
    expect(getObstacleSpeed()).toBe(0)
    expect(getCachedCollidingPositions()).toBeUndefined()
    expect(getPreviousObstacleStepsX()).toEqual([])
    expect(getPreviousObstacleStepsY()).toEqual([])
    expect(getOscillatingStationaryX()).toEqual([])
    expect(getOscillatingStationaryY()).toEqual([])
    expect(getObstacleVisualStateSnapshot()).toEqual({
      threeCoordX: [],
      threeCoordY: [],
      counter: -1,
      prevVisualX: [],
      prevVisualY: [],
      nextEngineX: [],
      nextEngineY: [],
    })

    resetObstaclesPerLevel()
  })

  it('resets animation arrays, previous steps, counters, and props idempotently', () => {
    resetSnakeAnimations()

    setSnakePreviousStepsArray([
      {
        previousStepX: 1,
        previousStepY: 0,
      },
    ])
    setSnakeTurnAround([1, 0])
    changeSnakeSpeed(3)
    setSnakeHeadLocationState({
      counterHeadX: 0.4,
      counterHeadY: -0.2,
      moveSpeed: 4,
      headVerticalStep: 1,
    })
    setPositionHead([1, 2, 3])
    setRotationHead([0.1, 0.2, 0.3])
    setCounterUnitsExact([
      [0.5, 0],
      [0, 0.5],
    ])
    setSnakeBodyMovementState({
      moveSpeed: 5,
      waveTime: 1.25,
      eatingTime: 2.5,
    })
    setSnakeBodyLocation([
      [1, 1],
      [0, 1],
    ])
    setDiff({ diffX: 1, diffY: 0 }, 0)
    setDiff({ diffX: 0, diffY: 1 }, 1)
    setSnakeUnitPosition([[1, 2, 3]])
    setSnakeUnitRotation([[0, 0, 1]])
    setSnakeUnitScale([[1.2, 1.2, 1.2]])
    setTailAnimatingQueueExact([{ name: 'turn-left', step: 4 }])
    setTailAnimationCounter(3)
    setIsTailAnimating(true)

    resetSnakeAnimations()
    resetSnakeAnimations()
    resetSnakePreviousStepsArray()
    resetSnakeTurnAround()
    resetSnakeSpeed()
    resetSnakeHeadLocation()
    resetSnakeHeadProps()
    resetSnakeBodyMovingState()
    resetSnakeBodyLocation()
    resetSnakeDiff()
    resetSnakeBodyProps()
    resetTailAnimationState()

    expect(getSnakePreviousStepsArray()).toEqual([])
    expect(getSnakeTurnAround()).toEqual([0, 0])
    expect(getSnakeSpeed()).toBe(1)
    expect(getCounterHead()).toEqual([0, 0])
    expect(getHeadVerticalStep()).toBe(0)
    expect(getPositionHead()).toEqual([0, 0, 0])
    expect(getRotationHead()).toEqual([0, 0, 0])
    expect(getCounterUnits()).toEqual([])
    expect(getSnakeBodyMovementState()).toEqual({
      moveSpeed: 1,
      waveTime: 0,
      eatingTime: 0,
    })
    expect(getSnakeBodyLocation()).toEqual([])
    expect(getDiff()).toEqual([])
    expect(getPreviousDiff()).toEqual([])
    expect(getSnakeUnitPosition()).toEqual([])
    expect(getSnakeUnitRotation()).toEqual([])
    expect(getSnakeUnitScale()).toEqual([])
    expect(getTailAnimatingQueue()).toEqual([])
    expect(getTailAnimatingCounter()).toBe(0)
    expect(getIsTailAnimating()).toBe(false)
  })

  it('resets render completion and transient HUD element mutations without timer cleanup', () => {
    const elements = {
      bonusElement: { innerHTML: ' 0', style: { opacity: '0.5' } },
      speedElement: { innerHTML: ' 4', style: { opacity: '0.5' } },
      lifeElement: { innerHTML: ' 0', style: { opacity: '0.5' } },
    }

    renderComplete()
    resetRenderInfo(elements)
    resetRender()
    resetRenderInfo(elements)
    resetRender()

    expect(checkRenderCompleting()).toBe(false)
    expect(elements.bonusElement).toEqual({
      innerHTML: '',
      style: { opacity: '', display: '' },
    })
    expect(elements.speedElement).toEqual({
      innerHTML: '',
      style: { opacity: '', display: '' },
    })
    expect(elements.lifeElement).toEqual({
      innerHTML: '',
      style: { opacity: '', display: '' },
    })
  })
})
