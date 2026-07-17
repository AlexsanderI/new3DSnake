/**
 * Валидирует и нормализует размер игрового поля
 * @param size - запрашиваемый размер поля
 * @param defaultSize - размер поля по умолчанию
 * @returns объект с итоговым размером и предупреждениями
 */
export function fieldSizeValidation(size: number, defaultSize: number): number {
  const warnings: string[] = []
  let validSize = size
  // Проверка на целое числовое значение
  if (!Number.isFinite(validSize)) {
    warnings.push(
      `WARNING! Invalid field size provided (${String(
        validSize
      )}). Falling back to default size ${defaultSize}.`
    )
    validSize = defaultSize
  } else if (!Number.isInteger(validSize) && validSize >= defaultSize) {
    warnings.push(
      'WARNING! The field size must be an integer. Rounding to the nearest integer.'
    )
    validSize = Math.round(validSize)
  }

  // Проверка минимального размера
  if (validSize < defaultSize) {
    warnings.push(
      `WARNING! The field cannot have less than ${defaultSize} cells on each side!`
    )
    validSize = defaultSize
  }
  // Проверка на четность (поле должно быть нечетным для симметрии)
  if (validSize % 2 === 0) {
    warnings.push('WARNING! The field cannot have an even number of cells on each side!')
    validSize = validSize + 1
  }

  // Выводим предупреждения в консоль для отладки
  warnings.forEach((warning) => console.log(warning))

  return validSize
}
