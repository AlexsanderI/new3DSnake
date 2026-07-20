import React, { memo } from 'react'
import { useMenuStore } from '../store/menuStore'
import '../styles/menu.css'
import { resumeWithLifecycle } from '../engine/session/lifecycleInput'
import { useLifecycleState } from '../store/sessionLifecycleStore'
import { productionSessionCommands } from '../engine/session/productionSession'
import { GameOverResultOverlay } from './GameOverResultOverlay'

const Menu: React.FC = () => {
  const { toggleModal, titleMenu, setModalVisible, selectTitleMenu } = useMenuStore()
  const lifecycleState = useLifecycleState()
  const terminalSnapshot = productionSessionCommands.getTerminalSnapshot()

  if (lifecycleState === 'game-over' && terminalSnapshot?.kind === 'game-over') {
    return (
      <div className='menu-game'>
        <GameOverResultOverlay
          snapshot={terminalSnapshot}
          actions={{
            onPlayAgain: () => {
              if (productionSessionCommands.playAgain()) {
                setModalVisible(false)
              }
            },
            onMainMenu: () => {
              if (productionSessionCommands.returnToMainMenu()) {
                selectTitleMenu('start')
                setModalVisible(true)
              }
            },
          }}
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
