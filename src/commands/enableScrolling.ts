import * as SCROLL from './scrollLockState'
import { preventScroll } from './scrollController'

export const enableScrolling = (): void => {
  // Проверяем, была ли блокировка
  if (!SCROLL.getScrollLockState().isLocked) return

  // Удаляем обработчик iOS
  document.removeEventListener('touchmove', preventScroll)

  // Восстанавливаем стили
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.paddingRight = ''
  document.body.classList.remove('no-scroll')

  // Восстанавливаем позицию скролла
  window.scrollTo(0, SCROLL.getScrollLockState().scrollY)

  // Сбрасываем состояние
  SCROLL.setScrollLockState({
    isLocked: false,
    scrollY: 0,
    scrollbarWidth: 0,
  })
}
