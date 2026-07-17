/**
 * @module setObstacleParams.ts Управляет препятствиями
 *    @function setObstacleParams Управляет движением и настройками препятствий
 */
import * as SPEED from './obstacleSpeed'
import moveObstacles from './moveObstacles'
/**
 * Устанавливает скорость и направление движения препятствий
 */
function setObstacleParams(speed: number): void {
  SPEED.obstacleSpeedCounter()

  if (SPEED.getObstacleSpeed() === speed) {
    ;['x', 'y'].forEach((type) => moveObstacles(type))

    SPEED.obstacleSpeedReset()
  }
}

export default setObstacleParams
