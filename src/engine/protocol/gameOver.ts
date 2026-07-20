/**
 *  @module gameOver.ts Обрабатывает событие окончания игры
 *     @function gameOver Выполняет закрытие текущей игры и запуск новой
 */
import { useMenuStore } from '../../store/menuStore'
import { reportGameOver } from '../session/gameOverReporter'
import type { EngineFailureReason } from '../session/resultSnapshots'
/**
 * Выводит сообщение, помещает протокол в хранилище и перезапускает игру
 * @param value параметр окончания игры: истекло время или кончились жизни
 */
function gameOver(value: string): void {
  const reported = reportGameOver(value as EngineFailureReason)
  if (!reported) return

  const { setModalVisible } = useMenuStore.getState()
  setModalVisible(true)
}

export default gameOver
