import { SnakeDiffLocation } from '../../../types/animationTypes'
/**
 * Массив объектов, хранящих текущие направления движения каждого
 * элемента змейки по вертикали и горизонтали
 */
let snakeDiff: SnakeDiffLocation[] = []
/**
 * Массив объектов, хранящих направления движения каждого
 * элемента змейки по вертикали и горизонтали до их последнего изменения
 */
let snakePreviousDiff: SnakeDiffLocation[] = []
/**
 * Функция вносит текущие направления движения каждого элемента змейки
 * в массив snakeDiffArray. Перед внесением изменений сохраняются предыдущие направления
 * @param newDiff - объект, хранящих текущие направления движения по вертикали и
 * горизонтали для одного элемента змейки
 * @param index - расположение элемента змейки в массиве snakeDiffArray.
 */
export function setDiff(newDiff: SnakeDiffLocation, index: number): void {
  snakePreviousDiff[index] = snakeDiff[index]
  snakeDiff[index] = newDiff
}
/**
 * возвращает массив объектов, хранящих текущие направления движения каждого
 * элемента змейки по вертикали и горизонтали
 * @returns массив объектов snakeDiff
 */
export function getDiff(): SnakeDiffLocation[] {
  return snakeDiff
}
/**
 * возвращает массив объектов, хранящих направления движения каждого
 * элемента змейки по вертикали и горизонтали до их последнего изменения
 * @returns массив объектов snakePreviousDiff
 */
export function getPreviousDiff(): SnakeDiffLocation[] {
  return snakePreviousDiff
}
