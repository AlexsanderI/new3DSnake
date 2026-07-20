import { createSessionCommands } from './sessionCommands'
import { setDefaultGameOverReportSession } from './gameOverReporter'
import { setDefaultVictoryReportSession } from './victoryReporter'

export const productionSessionCommands = createSessionCommands()

setDefaultGameOverReportSession(productionSessionCommands)
setDefaultVictoryReportSession(productionSessionCommands)
