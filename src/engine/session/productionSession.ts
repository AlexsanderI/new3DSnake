import { createSessionCommands } from './sessionCommands'
import { setDefaultGameOverReportSession } from './gameOverReporter'

export const productionSessionCommands = createSessionCommands()

setDefaultGameOverReportSession(productionSessionCommands)
