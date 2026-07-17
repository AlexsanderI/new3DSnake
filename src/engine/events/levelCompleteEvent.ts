/**
 *  @module levelCompleteEvent.ts Фиксирует успешное завершение уровня
 *     @function levelCompleteEvent Если уровень пройден, создает событие
 */
import { howMuchIsLeftToEat } from '../food/currentFoodNumber'
import { getCurrentLevel } from '../levels/currentLevel'
import protocolExecutor from '../protocol/protocolExecutor'

const LEVEL_COMPLETE_EVENT = 'level is complete'

/**
 * Создает событие успешного завершения уровня, если вся еда съедена вовремя
 * @returns true, если уровень пройден, и false, если нет
 */
function levelCompleteEvent(): boolean {
  // Если вся еда съедена — уровень завершён успешно
  if (howMuchIsLeftToEat() === 0) {
    protocolExecutor({
      name: LEVEL_COMPLETE_EVENT,
      value: getCurrentLevel(),
    })
    return true
  }

  return false
}

export default levelCompleteEvent
