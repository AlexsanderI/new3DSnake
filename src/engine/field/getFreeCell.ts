/**
 * @module getFreeCell.ts Рандомная генерация свободных ячеек
 *      @function getFreeCell Даёт координаты свободной ячейки
 */
import { getField } from './fieldPerLevel'

type CellValidator = (cell: [number, number]) => boolean

/**
 * Находит на игровом поле свободную ячейку и возвращает ее координаты
 * @param bookedCells массив занятых ячеек игрового поля
 * @description случайно выбирает одну из свободных ячеек, прошедших дополнительную проверку
 * @returns координаты свободной ячейки игрового поля или null, если подходящих ячеек не осталось
 */
const getFreeCell = (
  bookedCells: number[][],
  isValidCell: CellValidator = () => true,
): number[] | null => {
  const fieldSize = getField()
  const totalCells = fieldSize * fieldSize

  const filteredBookedCells = bookedCells.filter(
    (coord): coord is [number, number] =>
      Array.isArray(coord) &&
      coord.length === 2 &&
      coord.every((value) => typeof value === 'number' && Number.isFinite(value)) &&
      coord[0] > 0 &&
      coord[0] <= fieldSize &&
      coord[1] > 0 &&
      coord[1] <= fieldSize
  )

  const occupiedCells = new Set(
    filteredBookedCells.map(([cellX, cellY]) => `${cellX}:${cellY}`)
  )

  if (occupiedCells.size >= totalCells) return null

  const availableCells: [number, number][] = []

  for (let x = 1; x <= fieldSize; x += 1) {
    for (let y = 1; y <= fieldSize; y += 1) {
      if (occupiedCells.has(`${x}:${y}`)) continue

      const candidateCell: [number, number] = [x, y]
      if (isValidCell(candidateCell)) availableCells.push(candidateCell)
    }
  }

  if (!availableCells.length) return null

  const randomIndex = Math.floor(Math.random() * availableCells.length)
  return availableCells[randomIndex]
}

export default getFreeCell
