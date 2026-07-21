import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { Vector3 } from 'three'
import levelComplete from '../../../src/engine/protocol/levelComplete'
import { createSessionCommands } from '../../../src/engine/session/sessionCommands'
import { getCurrentLevel } from '../../../src/engine/levels/currentLevel'
import { getAmountOfFood } from '../../../src/engine/food/amountOfFoodPerLevel'
import {
  getSnakeBodyCoord,
  getSnakeHeadParams,
} from '../../../src/engine/snake/snake'
import {
  getCounterUnits,
  setCounterUnitsExact,
} from '../../../src/animations/snakeAnimation/bodyAnimations/snakeBodyMoving'
import { getSnakePreviousStepsArray } from '../../../src/animations/snakeAnimation/snakeAnimation'
import { getSnakeUnitPosition } from '../../../src/animations/snakeAnimation/bodyAnimations/snakeBodyProps'
import {
  getObstaclesX,
  getObstaclesXCoord,
  getObstaclesStepX,
} from '../../../src/engine/obstacles/obstaclesX'
import {
  getObstaclesY,
  getObstaclesYCoord,
  getObstaclesStepY,
} from '../../../src/engine/obstacles/obstaclesY'
import {
  getPreviousObstacleStepsX,
  getPreviousObstacleStepsY,
  setObstacleMovementHistory,
} from '../../../src/engine/obstacles/moveObstacles'
import {
  getObstacleVisualStateSnapshot,
  setObstacleVisualState,
} from '../../../src/components/obstacleVisualState'

function expectFiniteCoords(coords: number[][]): void {
  expect(coords.length).toBeGreaterThan(0)
  for (const coord of coords) {
    expect(coord.every(Number.isFinite)).toBe(true)
  }
}

function expectMovingObstaclesAreSeparated(coords: number[][]): void {
  if (coords.length <= 1) return

  const uniqueCoords = new Set(coords.map((coord) => coord.join(':')))
  expect(uniqueCoords.size).toBeGreaterThan(1)
}

describe('BUG-01 non-final level transitions', () => {
  let session = createSessionCommands()

  beforeEach(() => {
    session = createSessionCommands()
    expect(session.startSession()).toBe(true)
  })

  afterEach(() => {
    session.resetSession()
  })

  it('rebuilds snake animation state and obstacle state before activating the next non-final level', () => {
    setCounterUnitsExact([[999, 999]])
    setObstacleMovementHistory({
      previousX: [7],
      previousY: [-7],
      stationaryX: [[1, 2]],
      stationaryY: [[3, 4]],
    })
    setObstacleVisualState({
      threeCoordX: [new Vector3(99, 99, 0)],
      threeCoordY: [new Vector3(-99, -99, 0)],
      counter: 0,
      prevVisualX: [99],
      prevVisualY: [-99],
      nextEngineX: [98],
      nextEngineY: [-98],
    })

    levelComplete()

    expect(getCurrentLevel()).toBe(2)
    expect(session.getState()).not.toBe('victory')

    const expectedSnakeAnimationUnits = getAmountOfFood() + 1
    const head = getSnakeHeadParams()
    expect(Number.isFinite(head.snakeHeadCoordX)).toBe(true)
    expect(Number.isFinite(head.snakeHeadCoordY)).toBe(true)
    expect(Number.isFinite(head.snakeHeadStepX)).toBe(true)
    expect(Number.isFinite(head.snakeHeadStepY)).toBe(true)
    expect(getSnakeBodyCoord()).toHaveLength(3)
    expect(getSnakePreviousStepsArray()).toHaveLength(expectedSnakeAnimationUnits)
    expect(getSnakeUnitPosition()).toHaveLength(expectedSnakeAnimationUnits)
    expect(getCounterUnits()).toHaveLength(expectedSnakeAnimationUnits)
    expectFiniteCoords(getSnakeUnitPosition())

    expect(getObstaclesXCoord()).toHaveLength(getObstaclesX().length)
    expect(getObstaclesStepX()).toHaveLength(getObstaclesXCoord().length)
    expect(getObstaclesYCoord()).toHaveLength(getObstaclesY().length)
    expect(getObstaclesStepY()).toHaveLength(getObstaclesYCoord().length)
    expectMovingObstaclesAreSeparated([...getObstaclesXCoord(), ...getObstaclesYCoord()])
    expect(getPreviousObstacleStepsX()).toEqual([])
    expect(getPreviousObstacleStepsY()).toEqual([])

    expect(getObstacleVisualStateSnapshot()).toEqual({
      threeCoordX: [],
      threeCoordY: [],
      counter: -1,
      prevVisualX: [],
      prevVisualY: [],
      nextEngineX: [],
      nextEngineY: [],
    })

    levelComplete()

    expect(getCurrentLevel()).toBe(3)
    expect(getCounterUnits()).toHaveLength(getAmountOfFood() + 1)
    expect(getPreviousObstacleStepsX()).toEqual([])
    expect(getPreviousObstacleStepsY()).toEqual([])
    expect(getObstacleVisualStateSnapshot().counter).toBe(-1)
  })
})
