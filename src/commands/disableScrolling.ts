import * as SCROLL from './scrollLockState'
import { getScrollbarWidth } from './getScrollbarWidth'
import { preventScroll } from './scrollController'

export const disableScrolling = (): void => {
  // Предотвращаем повторную блокировку
  if (SCROLL.getScrollLockState().isLocked) return

  // Сохраняем текущее состояние
  SCROLL.setScrollLockState({
    isLocked: true,
    scrollY: window.scrollY,
    scrollbarWidth: getScrollbarWidth(),
  })

  // Компенсируем исчезновение скроллбара
  document.body.style.paddingRight = `${SCROLL.getScrollLockState().scrollbarWidth}px`

  // Фиксируем позицию
  document.body.style.position = 'fixed'
  document.body.style.top = `-${SCROLL.getScrollLockState().scrollY}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.classList.add('no-scroll')

  // Предотвращаем скролл на iOS
  document.addEventListener('touchmove', preventScroll, { passive: false })
}
