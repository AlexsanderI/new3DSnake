import { describe, expect, it } from 'vitest'

import {
  addSnakeBodyCoord,
  getPreviousSnake,
  getSnakeBodyCoord,
  getSnakeHeadParams,
  getStoppedSnakeDirection,
  resetSnake,
  setSnakeBodyCoord,
  setSnakeHeadParams,
  setStoppedSnakeDirection,
} from '../../../src/engine/snake/snake'
import {
  getAmountOfFood,
  setAmountOfFood,
} from '../../../src/engine/food/amountOfFoodPerLevel'
import {
  getCurrentFoodNumber,
  resetCurrentFoodNumber,
  setCurrentFoodNumberExact,
} from '../../../src/engine/food/currentFoodNumber'
import {
  getFoodCoord,
  getFoodScores,
  resetFood,
  setFoodCoord,
  setFoodScores,
} from '../../../src/engine/food/food'
import {
  getBonusCoord,
  getCurrentBonus,
  setBonusCoord,
  setCurrentBonus,
} from '../../../src/engine/bonuses/bonus'
import {
  getBonusAvailability,
  giveBonus,
} from '../../../src/engine/bonuses/bonusAvailableState'
import {
  catchBonus,
  getBonusCatchingStatus,
} from '../../../src/engine/bonuses/bonusCatchingState'
import {
  getBonuses,
  setBonuses,
} from '../../../src/engine/bonuses/bonusesPerLevel'
import {
  getBonusParams,
  setBonusParams,
} from '../../../src/engine/bonuses/bonusParams'
import {
  getStopsGrowing,
  setStopsGrowing,
} from '../../../src/engine/bonuses/bonusSnakeStopsGrowing'
import {
  getCrossesBorders,
  setCrossesBorders,
} from '../../../src/engine/bonuses/bonusSnakeCrossesBorders'
import {
  getBreaksObstacles,
  setBreaksObstacles,
} from '../../../src/engine/bonuses/bonusSnakeBreaksObstacles'
import {
  getDoubleScoresFood,
  setDoubleScoresFood,
} from '../../../src/engine/bonuses/bonusDoubleScoresFood'
import {
  bonusAddTime,
  checkAddTime,
} from '../../../src/engine/bonuses/bonusAddTime'
import {
  bonusAddLives,
  checkAddLives,
} from '../../../src/engine/bonuses/bonusAddLives'
import {
  bonusAddScores,
  checkAddScores,
} from '../../../src/engine/bonuses/bonusAddScores'
import { resetBonuses } from '../../../src/engine/bonuses/resetBonuses'

describe('T4A world-state reset APIs', () => {
  it('resets snake head, body, previous body, and stopped direction idempotently', () => {
    resetSnake()

    setSnakeHeadParams({
      snakeHeadCoordX: 7,
      snakeHeadCoordY: 8,
      snakeHeadStepX: 1,
      snakeHeadStepY: 0,
    })
    addSnakeBodyCoord([7, 8])
    setSnakeBodyCoord([
      [6, 8],
      [5, 8],
    ])
    setStoppedSnakeDirection([1, 0])

    resetSnake()
    resetSnake()

    expect(getSnakeHeadParams()).toEqual({
      snakeHeadCoordX: 0,
      snakeHeadCoordY: 0,
      snakeHeadStepX: 0,
      snakeHeadStepY: 0,
    })
    expect(getSnakeBodyCoord()).toEqual([])
    expect(getPreviousSnake()).toEqual([])
    expect(getStoppedSnakeDirection()).toBeNull()
  })

  it('resets food amount, current food number, position, and score idempotently', () => {
    resetFood()

    setAmountOfFood(4)
    setCurrentFoodNumberExact(3)
    setFoodCoord([2, 5])
    setFoodScores(25)

    resetFood()
    resetFood()

    expect(getAmountOfFood()).toBe(1)
    expect(getCurrentFoodNumber()).toBe(0)
    expect(getFoodCoord()).toEqual([0, 0])
    expect(getFoodScores()).toBe(0)
  })

  it('resets current bonus, availability, caught state, params, and all active flags without changing level config', () => {
    resetBonuses()

    const configuredBonuses = [
      {
        type: 'snake-stops-growing',
        value: 1,
        startFood: 1,
        endFood: 2,
      },
    ]

    setBonuses(configuredBonuses)
    setCurrentBonus(2)
    setBonusCoord([4, 5])
    setBonusParams({
      type: 'double-scores-food',
      value: 2,
      startFood: 1,
      endFood: 3,
    })
    setCurrentFoodNumberExact(2)
    catchBonus(true)
    giveBonus()
    setStopsGrowing(true)
    setCrossesBorders(true)
    setBreaksObstacles(true)
    setDoubleScoresFood(true)
    bonusAddTime()
    bonusAddLives()
    bonusAddScores()

    resetBonuses()
    resetBonuses()

    expect(getCurrentBonus()).toBe(-1)
    expect(getBonusCoord()).toEqual([0, 0])
    expect(getBonusAvailability()).toBe(false)
    expect(getBonusCatchingStatus()).toEqual({
      isBonusCaught: false,
      caughtFoodNumber: -1,
    })
    expect(getBonusParams()).toEqual({
      type: '',
      value: 0,
      startFood: 0,
      endFood: 0,
    })
    expect(getStopsGrowing()).toBe(false)
    expect(getCrossesBorders()).toBe(false)
    expect(getBreaksObstacles()).toBe(false)
    expect(getDoubleScoresFood()).toBe(false)
    expect(checkAddTime()).toBe(false)
    expect(checkAddLives()).toBe(false)
    expect(checkAddScores()).toBe(false)
    expect(getBonuses()).toEqual(configuredBonuses)
  })
})
