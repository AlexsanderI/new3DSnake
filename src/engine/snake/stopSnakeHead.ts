/**
 * @module stopSnakeHead.ts Управляет остановкой змейки при контакте
 *    @function stopSnakeHead Останавливает движение змейки при контакте
 */
/**
 * Возвращает новый объект состояния головы змейки после контакта (движение останавливается).
 * @param nextHeadCoords Координаты головы после контакта
 */
export function stopSnakeHead(nextHeadCoords: {
  snakeHeadCoordX: number
  snakeHeadCoordY: number
  snakeHeadStepX: number
  snakeHeadStepY: number
}) {
  return {
    ...nextHeadCoords,
    snakeHeadStepX: 0,
    snakeHeadStepY: 0,
  }
}
