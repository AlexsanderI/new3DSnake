/**
 * @module food.ts Управляет параметрами еды на текущем уровне
 *    @var foodScores Количество баллов за еду
 *    @var foodCoord Координаты еды
 *    @function setFoodScores Задает количество баллов за еду
 *    @function setFoodCoord Задает координаты еды
 *    @function getFoodScores Возвращает количество баллов за еду
 *    @function getFoodCoord Возвращает координаты еды
 */
import { Coordinate } from '../../types/obstacleTypes'
/**
 * @var Количество баллов, которые получает игрок за съеденый объект еды
 */
let foodScores: number
/**
 * @var Массив координат X и Y текущей еды
 */
let foodCoord: Coordinate
/**
 * Задает количество баллов, которые игрок получает за каждую съеденную еду
 * @param score
 */
export function setFoodScores(score: number) {
  foodScores = score
}
/**
 * Задает координаты X и Y текущей еды
 * @param coord
 */
export function setFoodCoord(coord: Coordinate) {
  foodCoord = [...coord]
}
/**
 * Возвращает количество баллов, которые игрок получает за каждую съеденную еду
 * @returns foodScores
 */
export function getFoodScores(): number {
  return foodScores
}
/**
 * Возвращает координаты X и Y текущей еды
 * @returns foodCoord
 */
export function getFoodCoord(): Coordinate {
  return foodCoord
}
