/**
 * @module cellsBooking.ts Выделяет место вокруг заданной координаты
 *    @function cellsBooking Резервирует пустые ячейки вокруг заданной координаты
 */
/**
 * Вычисляет координаты ячеек в квадратной области с заданной координатой в центре
 * @param coordX X-координата центра области
 * @param coordY Y-координата центра области
 * @param size Размер стороны квадратной области вокруг заданной координаты (по умолчанию 3)
 * @param fieldSize Размер игрового поля (для проверки границ, опционально)
 * @returns Массив с координатами зарезервированных ячеек вокруг заданной координаты
 */
function cellsBooking(
  coordX: number,
  coordY: number,
  size: number = 3,
  fieldSize?: number
): number[][] {
  const booking: number[][] = []
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const checkX = coordX + dx
      const checkY = coordY + dy
      if (
        fieldSize === undefined ||
        (checkX >= 0 && checkY >= 0 && checkX < fieldSize && checkY < fieldSize)
      ) {
        booking.push([checkX, checkY])
      }
    }
  }
  return booking
}

export default cellsBooking
