/**
 * @module obstaclesPerLevel.ts Управляет препятствиями на уровне
 *    @var obstaclesPerLevel Массив строк 'x', 'y' и 'fix' для всех препятствия
 *    @function setObstacles Задает общий массив строк и массивы каждого типа
 *    @function getObstacles Возвращает общий массив строк
 */
import { resetObstaclesX, setObstaclesX } from "./obstaclesX";
import { resetObstaclesY, setObstaclesY } from "./obstaclesY";
import { resetObstaclesFix, setObstaclesFix } from "./obstaclesFix";
/**
 * @var массив движения: 'y'- вертикально, 'x'-горизонтально, 'fix'-неподвижно
 */
let obstaclesPerLevel: string[] = [];
/**
 * Задает массив для каждого препятствия и сортирует их по направлению движения
 * @param obstacles массив ключевых слов для препятствий текущего уровня
 */
export function setObstacles(obstacles: string[]): void {
  obstaclesPerLevel = [...obstacles];
  setObstaclesX();
  setObstaclesY();
  setObstaclesFix();
}
export function resetObstaclesPerLevel(): void {
  obstaclesPerLevel = [];
  resetObstaclesX();
  resetObstaclesY();
  resetObstaclesFix();
}
/**
 * Возвращает массив ключевых слов для каждого препятствия
 * @returns obstaclesPerLevel
 */
export function getObstacles(): string[] {
  return obstaclesPerLevel;
}
