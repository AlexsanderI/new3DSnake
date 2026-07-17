import * as SCROLL from './scrollLockState'
import { enableScrolling } from './enableScrolling'

// Вспомогательная функция для iOS
export const preventScroll = (e: TouchEvent): void => {
  e.preventDefault()
}

// Утилита для проверки состояния
export const isScrollLocked = (): boolean => SCROLL.getScrollLockState().isLocked

// Утилита для принудительного сброса (на случай ошибок)
export const resetScrollLock = (): void => {
  if (SCROLL.getScrollLockState().isLocked) {
    enableScrolling()
  }
}
