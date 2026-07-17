/**
 * @module cellsBookingAroundSnake.ts Выделяет место змейке для начала движения
 *    @function cellsBookingAroundSnake Резервирует пустые ячейки вокруг змейки
 */
/**
 * Вычисляет координаты ячеек в квадратной области по стороне и левому верхнему углу
 * @param topLeftX X-координата левого верхнего угла области
 * @param topLeftY Y-координата левого верхнего угла области
 * @param size Размер стороны квадратной области вокруг змейки (по умолчанию 3)
 * @param fieldSize Размер игрового поля (для проверки границ, опционально)
 * @returns Массив с координатами зарезервированных ячеек вокруг змейки
 */
function cellsBookingAroundSnake(
  topLeftX: number,
  topLeftY: number,
  size: number = 3,
  fieldSize?: number
): number[][] {
  const booking: number[][] = []
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const x = topLeftX + row
      const y = topLeftY + col
      if (
        fieldSize === undefined ||
        (x >= 0 && y >= 0 && x < fieldSize && y < fieldSize)
      ) {
        booking.push([x, y])
      }
    }
  }
  return booking
}

export default cellsBookingAroundSnake
