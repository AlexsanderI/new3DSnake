/**
 * @module fieldPerLevel.ts Управление размерами игрового поля
 *    @var fieldPerLevel количество ячеек по стороне квадратного поля
 *    @function setField Задает количество ячеек по стороне поля
 *    @function getField Возвращает количество ячеек по стороне поля
 */
import { fieldSizeValidation } from './fieldSizeValidation'
const DEFAULT_FIELD_SIZE = 5
/**
 * @var количество ячеек по стороне квадратного игрового поля на текущем уровне
 */
let fieldPerLevel: number = DEFAULT_FIELD_SIZE // Инициализируем значением по умолчанию
/**
 * Задает количество ячеек по стороне квадратного игрового поля на текущем уровне
 * @param size - размер поля (количество ячеек по стороне)
 */
export function setField(size: number): void {
  fieldPerLevel = fieldSizeValidation(size, DEFAULT_FIELD_SIZE)
}
/**
 * Возвращает количество ячеек по стороне квадратного игрового поля на текущем уровне
 * @returns размер поля
 */
export function getField(): number {
  return fieldPerLevel
}
