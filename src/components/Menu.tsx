import React, { memo } from 'react'
import { useMenuStore } from '../store/menuStore'
import '../styles/menu.css'
import { resumeWithLifecycle } from '../engine/session/lifecycleInput'

const Menu: React.FC = () => {
  const { toggleModal, titleMenu } = useMenuStore()
  return (
    <div
      className='menu-game'
      onClick={() => {
        if (titleMenu.indexOf('Game over') !== -1) location.reload()
        else if (titleMenu === 'Pause') {
          resumeWithLifecycle()
        } else toggleModal()
      }}
    >
      <h2>{titleMenu}</h2>
    </div>
  )
}

export default memo(Menu)
