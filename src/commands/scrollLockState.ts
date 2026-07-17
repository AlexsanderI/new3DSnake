import { ScrollLockState } from '../types/controlsTypes'

let scrollLockState: ScrollLockState = {
  isLocked: false,
  scrollY: 0,
  scrollbarWidth: 0,
}

export const setScrollLockState = (state: ScrollLockState): void => {
  scrollLockState = { ...state }
}

export const getScrollLockState = (): ScrollLockState => scrollLockState
