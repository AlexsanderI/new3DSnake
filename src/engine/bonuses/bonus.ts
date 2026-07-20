/**
 * @module bonus.ts Управляет бонусами на текущем уровне
 *    @var currentBonus Индекс текущего бонуса в массиве всех бонусов
 *    @var bonusCoord Координаты текущего бонуса
 *    @function setCurrentBonus Задает индекс текущего бонуса
 *    @function setBonusCoord Задает координаты текущего бонуса
 *    @function getCurrentBonus Возвращает индекс текущего бонуса
 *    @function getBonusCoord Возвращает координаты бонуса
 */
/**
 * @var Индекс текущего бонуса в массиве всех бонусов
 */
const INITIAL_CURRENT_BONUS = -1;
const INITIAL_BONUS_COORD = [0, 0];

let currentBonus = INITIAL_CURRENT_BONUS;
/**
 * @var Массив координат X и Y текущего бонуса
 */
let bonusCoord: number[] = [...INITIAL_BONUS_COORD];
/**
 * Задает индекс текущего бонуса в массиве всех бонусов
 * @param index номер текущего бонуса в массиве бонусов
 * @usedIn bonusHandlers.ts
 */
export function setCurrentBonus(index: number) {
  currentBonus = index;
}
export function resetCurrentBonus(): void {
  currentBonus = INITIAL_CURRENT_BONUS;
}
/**
 * Задает координаты X и Y текущего бонуса
 * @param coord координаты текущего бонуса
 * @usedIn setBonusEvent.ts
 */
export function setBonusCoord(coord: number[]) {
  bonusCoord = [...coord];
}
export function resetBonusCoord(): void {
  bonusCoord = [...INITIAL_BONUS_COORD];
}
/**
 * Возвращает индекс текущего бонуса в массиве всех бонусов
 * @returns currentBonus индекс текущего бонуса
 * @usedIn Bonuses.tsx
 */
export function getCurrentBonus(): number {
  return currentBonus;
}
/**
 * Возвращает координаты X и Y текущего бонуса
 * @returns bonusCoord координаты текущего бонуса
 * @usedIn Bonuses.tsx, setBonusEvent.ts, contactBonusObstacle.ts
 */
export function getBonusCoord(): number[] {
  return bonusCoord;
}
export function resetBonus(): void {
  resetCurrentBonus();
  resetBonusCoord();
}
