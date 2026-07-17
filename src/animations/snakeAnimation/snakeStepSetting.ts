/**
 * @module snakeStepSetting.ts Задает направление движения головы змейки при рендере
 *    @function snakeStepSetting Передает рендеру команды игрока
 */
import { getProtocol } from '../../engine/protocol/protocol'
import moveSnake from '../../engine/snake/moveSnake'
import {
  getSnakeBodyCoord,
  getSnakeHeadParams,
  setSnakeHeadParams,
} from '../../engine/snake/snake'
import checkTimerStep from '../../engine/time/checkTimerStep'
import { checkTimerWorking } from '../../engine/time/isTimer'
import { SnakeSteps } from '../../types/animationTypes'
import snakeBodyDiff from './bodyAnimations/snakeBodyDiff'
import {
  getSnakeBodyLocation,
  setSnakeBodyLocation,
} from './bodyAnimations/snakeBodyLocation'
import { getSnakeUnitPosition } from './bodyAnimations/snakeBodyProps'
import { getDiff, setDiff } from './bodyAnimations/snakeDiff'
import { getCounterHead } from './headAnimations/snakeHeadLocation'

const snakeTurnAround = [0, 0]

export const setSnakeTurnAround = (turn: number[]) => {
  snakeTurnAround.length = 0
  snakeTurnAround.push(turn[0], turn[1])
}

export const getSnakeTurnAround = () => snakeTurnAround

/**
 * Задает направление движения головы змейки при рендере по данным движка.
 * @param step Текущее и предыдущее направления движения головы змейки
 *             при рендера по осям X и Y
 * @description
 * 1. Функция работает только в момент нахождения змейки в узлах игрового поля
 * 2. Здесь рендер получает текущее направление движения головы змейки от движка
 * 3. При быстрой смене направлений змейка теряет промежуточные команды и может
 *    начать движение в обратном направлении, что приводит к ошибке. На этом этапе
 *    запрещается движение змейки в обратном направлении.
 * @returns step, содержащий актуальные данные о направлении движения головы змейки
 *                с учетом корректировки
 */
export const snakeStepSetting = (step: SnakeSteps[]): SnakeSteps[] => {
  let newStep: SnakeSteps[] = [...step]

  // Функция работает только в момент нахождения рендера в узлах игрового поля
  if (getCounterHead()[0] === 0 && getCounterHead()[1] === 0 && checkTimerWorking()) {
    // newStep = [...step]
    // console.log('new step: ')
    // console.log(
    //   'Location life: ',
    //   getSnakeBodyLocation()[0],
    //   getSnakeBodyLocation()[1],
    //   getSnakeBodyLocation()[2]
    // )

    // Здесь рендер получает текущее направление движения головы змейки от движка
    for (let i = newStep.length - 1; i > 0; i--) {
      newStep[i].currentStepX = newStep[i - 1].currentStepX
      newStep[i].currentStepY = newStep[i - 1].currentStepY
    }
    // newStep = step.map((item, index) => {
    // item.currentStepX = getDiff()[index].diffX
    // item.currentStepY = getDiff()[index].diffY
    // item.currentStepX = getSnakeHeadParams().snakeHeadStepX
    //   // item.currentStepY = getSnakeHeadParams().snakeHeadStepY
    //   return item
    // })

    newStep[0].currentStepX = getSnakeHeadParams().snakeHeadStepX
    newStep[0].currentStepY = getSnakeHeadParams().snakeHeadStepY
    // }
    // console.log('before: ', getDiff()[0], getDiff()[1])

    // На этом этапе запрещается движение змейки в обратном направлении
    if (
      newStep[0].currentStepX !== 0 &&
      newStep[0].currentStepX === -newStep[0].previousStepX
    ) {
      newStep[0].currentStepX = 0
      newStep[0].currentStepY = +getProtocol()[getProtocol().length - 2].value
      setSnakeTurnAround([1, 0])
      setDiff({ diffX: newStep[0].currentStepX, diffY: newStep[0].currentStepY }, 0)
    }

    if (
      newStep[0].currentStepY !== 0 &&
      newStep[0].currentStepY === -newStep[0].previousStepY
    ) {
      newStep[0].currentStepY = 0
      newStep[0].currentStepX = +getProtocol()[getProtocol().length - 2].value
      setSnakeTurnAround([0, 1])
      setDiff({ diffX: newStep[0].currentStepX, diffY: newStep[0].currentStepY }, 0)
    }

    // item.currentStepX = 0
    // item.currentStepY = +getProtocol()[getProtocol().length - 2].value
    // setDiff({ diffX: item.currentStepX, diffY: item.currentStepY }, index)

    // item.currentStepY = 0
    // item.currentStepX = +getProtocol()[getProtocol().length - 2].value
    // setDiff({ diffX: item.currentStepX, diffY: item.currentStepY }, index)

    //   // if (index < 2) console.log(`${index}-before: `, item)

    //   if (item.currentStepX !== 0 && item.currentStepX === -item.previousStepX) {
    //     item.currentStepX = 0
    //     item.currentStepY = +getProtocol()[getProtocol().length - 2].value

    //     setDiff({ diffX: item.currentStepX, diffY: item.currentStepY }, index)
    //     console.log('X: ', index)
    //   }
    //   if (item.currentStepY !== 0 && item.currentStepY === -item.previousStepY) {
    //     item.currentStepY = 0
    //     item.currentStepX = +getProtocol()[getProtocol().length - 2].value

    //     setDiff({ diffX: item.currentStepX, diffY: item.currentStepY }, index)
    //     console.log('Y: ', index)
    //   }
    //   // setDiff({ diffX: item.currentStepX, diffY: item.currentStepY }, index + 1)
    //   // if (index < 2) console.log(`${index}-after: `, item)

    // if (stepsCounter[stepsCounter.length - 1] > getSnakeBodyCoord().length - 2)
    //   stepsCounter.length = 0
    // if (stepsCounter > getSnakeBodyCoord().length - 2) stepsCounter = 0
    // console.log(newStep)
    // console.log('after: ', getDiff()[0], getDiff()[1])
    //console.log(speedTurn, getSnakeBodyCoord().length - 2)
  }

  // if (step[0].currentStepX !== 0 && step[0].currentStepX === -step[0].previousStepX) {
  //   step[0].currentStepX = 0
  //   step[0].currentStepY = +getProtocol()[getProtocol().length - 2].value

  //   setDiff({ diffX: step[0].currentStepX, diffY: step[0].currentStepY }, 0)
  // }
  // if (step[0].currentStepY !== 0 && step[0].currentStepY === -step[0].previousStepY) {
  //   step[0].currentStepY = 0
  //   step[0].currentStepX = +getProtocol()[getProtocol().length - 2].value

  //   setDiff({ diffX: step[0].currentStepX, diffY: step[0].currentStepY }, 0)
  // }

  // const output = newStep.length !== 0 ? newStep : step
  // console.log(output)
  // setSnakeHeadParams({
  //   ...headParams,
  //   snakeHeadStepX: step[0].currentStepX,
  //   snakeHeadStepY: step[0].currentStepY,
  // })

  return newStep
}
