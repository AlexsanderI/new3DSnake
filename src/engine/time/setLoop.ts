/**
 *  @module setLoop.ts Управляет игровым циклом
 *     @function setLoop Рекурсивная функция, позволяющая менять скорость игры
 */
import { runLifecycleFrame } from '../session/lifecycleFrame'
/**
 * Запускает setLoop() каждые timerStepPerLevel миллисекунд в котором:
 *  - проверяет условия прерывания игры
 *  - запускается функция управления игрой playLevel()
 *  - производится рендер актуального состояния игрового поля
 *  - устанавливается актуальное значение интервала перерисовки игрового поля
 */
function setLoop(delta: number) {
  runLifecycleFrame(delta)
}

export default setLoop
