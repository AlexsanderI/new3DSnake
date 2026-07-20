import { resetBonus } from './bonus'
import { resetBonusAddLives } from './bonusAddLives'
import { resetBonusAddScores } from './bonusAddScores'
import { resetBonusAddTime } from './bonusAddTime'
import { resetBonusAvailability } from './bonusAvailableState'
import { resetBonusCatchingState } from './bonusCatchingState'
import { resetDoubleScoresFood } from './bonusDoubleScoresFood'
import { resetBonusParams } from './bonusParams'
import { resetBreaksObstacles } from './bonusSnakeBreaksObstacles'
import { resetCrossesBorders } from './bonusSnakeCrossesBorders'
import { resetStopsGrowing } from './bonusSnakeStopsGrowing'

export function resetBonuses(): void {
  resetBonus()
  resetBonusAvailability()
  resetBonusCatchingState()
  resetBonusParams()
  resetStopsGrowing()
  resetCrossesBorders()
  resetBreaksObstacles()
  resetDoubleScoresFood()
  resetBonusAddTime()
  resetBonusAddLives()
  resetBonusAddScores()
}
