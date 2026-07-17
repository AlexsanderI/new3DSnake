/**
 * @module amountOfFoodPerLevel Управление количеством еды на уровне
 *    @var amountOfFoodPerLevel Общее количество еды
 *    @function setAmountOfFood Задает общее кличество еды
 *    @function getAmountOfFood Возвращает общее кличество еды
 */
const MINIMAL_AMOUNT_OF_FOOD_PER_LEVEL = 1
/**
 * @var количество объектов еды, которое необходимо съесть змейке, чтобы успешно пройти уровень
 */
let amountOfFoodPerLevel = MINIMAL_AMOUNT_OF_FOOD_PER_LEVEL
/**
 * Задает количество объектов еды, которое необходимо съесть змейке, чтобы успешно пройти уровень
 * @param amountOfFood - количество еды (должно быть положительным целым числом)
 * @throws {Error} Если передано некорректное значение
 */
export function setAmountOfFood(amountOfFood: number): void {
  // Валидация входных данных
  if (typeof amountOfFood !== 'number' || !Number.isFinite(amountOfFood)) {
    throw new Error(
      `setAmountOfFood: Некорректное значение - ${amountOfFood}. Ожидается конечное число.`
    )
  }
  if (amountOfFood < MINIMAL_AMOUNT_OF_FOOD_PER_LEVEL) {
    throw new Error(
      `setAmountOfFood: Количество еды должно быть положительным. Получено: ${amountOfFood}`
    )
  }
  if (!Number.isInteger(amountOfFood)) {
    console.warn(
      `setAmountOfFood: Дробное значение ${amountOfFood} будет округлено до ${Math.round(
        amountOfFood
      )}`
    )
    amountOfFood = Math.round(amountOfFood)
  }

  amountOfFoodPerLevel = amountOfFood
}
/**
 * Возвращает количество объектов еды, которое необходимо съесть змейке, чтобы успешно пройти уровень
 * @returns количество еды на уровне
 */
export function getAmountOfFood(): number {
  return amountOfFoodPerLevel
}
/**
 * Сбрасывает количество еды к значению по умолчанию
 */
export function resetAmountOfFood(): void {
  amountOfFoodPerLevel = MINIMAL_AMOUNT_OF_FOOD_PER_LEVEL
}
/**
 * Проверяет, установлено ли корректное количество еды
 * @returns true, если количество еды корректно
 */
export function isAmountOfFoodValid(): boolean {
  return (
    Number.isInteger(amountOfFoodPerLevel) &&
    amountOfFoodPerLevel >= MINIMAL_AMOUNT_OF_FOOD_PER_LEVEL
  )
}
