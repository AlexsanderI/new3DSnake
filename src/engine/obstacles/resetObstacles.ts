import { obstacleSpeedReset } from './obstacleSpeed'
import { resetObstacleMovementHistory } from './moveObstacles'
import { resetObstaclesPerLevel } from './obstaclesPerLevel'
import { resetCollidingPositionsCache } from './setObstacleStep'

export function resetObstacles(): void {
  resetObstaclesPerLevel()
  obstacleSpeedReset()
  resetObstacleMovementHistory()
  resetCollidingPositionsCache()
}
