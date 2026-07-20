/**
 * @module bonusParams.ts Управляет параметрами текущего бонуса
 *    @var bonusParams Хранит тип, значение и момент появление бонуса на поле
 *    @function setBonusParams Устанавливает параметры текущего бонуса
 *    @function getBonusParams Возвращает параметры текущего бонуса
 */
import { BonusProps } from '../../types/bonusTypes'

const INITIAL_BONUS_PARAMS: BonusProps = {
  type: '',
  value: 0,
  startFood: 0,
  endFood: 0,
}
/**
 * @var bonusParams Параметры текущего бонуса: тип, значение и момент появления
 */
let bonusParams: BonusProps = { ...INITIAL_BONUS_PARAMS }
/**
 * Задает данные текущего бонуса
 */
export function setBonusParams(bonus: BonusProps): void {
  bonusParams = { ...bonus }
}
export function resetBonusParams(): void {
  bonusParams = { ...INITIAL_BONUS_PARAMS }
}
/**
 * Возвращает параметры текущего бонуса: тип, значение и момент появления
 * @returns bonusParams
 */
export function getBonusParams(): BonusProps {
  return bonusParams
}
