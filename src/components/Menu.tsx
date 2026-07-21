import React, { memo } from 'react'
import { useMenuStore } from '../store/menuStore'
import '../styles/menu.css'
import { resumeWithLifecycle } from '../engine/session/lifecycleInput'
import { useLifecycleState } from '../store/sessionLifecycleStore'
import { productionSessionCommands } from '../engine/session/productionSession'
import { GameOverResultOverlay } from './GameOverResultOverlay'
import { VictoryResultOverlay } from './VictoryResultOverlay'
import { createResultActions } from './resultActions'

const Menu: React.FC = () => {
  const { toggleModal, titleMenu } = useMenuStore()
  const lifecycleState = useLifecycleState()
  const terminalSnapshot = productionSessionCommands.getTerminalSnapshot()
  const resultActions = createResultActions()

  if (lifecycleState === 'game-over' && terminalSnapshot?.kind === 'game-over') {
    return (
      <div className='menu-game'>
        <GameOverResultOverlay
          snapshot={terminalSnapshot}
          actions={resultActions}
        />
      </div>
    )
  }

  if (lifecycleState === 'victory' && terminalSnapshot?.kind === 'victory') {
    return (
      <div className='menu-game'>
        <VictoryResultOverlay
          snapshot={terminalSnapshot}
          actions={resultActions}
        />
      </div>
    )
  }

  return (
    <div
      className='menu-game'
      onClick={() => {
        if (titleMenu === 'Pause') {
          resumeWithLifecycle()
        } else toggleModal()
      }}
    >
      <h2>{titleMenu}</h2>
    </div>
  )
}

export default memo(Menu)
