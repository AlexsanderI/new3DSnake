/**
 * @module cellsAroundObstacle.ts Резервирует ячейки вокруг препятствия
 */

/**
 * Резервирует ячейки в радиусе 2 клеток вокруг препятствия
 * Препятствие не должно располагаться ближе чем на 2 клетки друг от друга
 * по горизонтали и вертикали
 * @param obstacleX координата X препятствия
 * @param obstacleY координата Y препятствия
 * @param fieldSize размер игрового поля
 * @returns массив ячеек, которые должны быть зарезервированы
 */
export const cellsAroundObstacle = (
  obstacleX: number,
  obstacleY: number,
  fieldSize: number,
): number[][] => {
  const reserved: number[][] = []

  // Резервируем все ячейки в квадрате 2x2 вокруг препятствия
  // Диапазон: [obstacleX-1...obstacleX+1] по X, [obstacleY-1...obstacleY+1] по Y
  for (let x = obstacleX - 1; x <= obstacleX + 1; x++) {
    for (let y = obstacleY - 1; y <= obstacleY + 1; y++) {
      // Проверяем границы поля (координаты 1-based)
      if (x >= 1 && x <= fieldSize && y >= 1 && y <= fieldSize) {
        reserved.push([x, y])
      }
    }
  }

  return reserved
}
