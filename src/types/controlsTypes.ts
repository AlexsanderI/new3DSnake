export interface Touch {
  x: number
  y: number
}

// Блокировка прокрутки экрана
export interface ScrollLockState {
  isLocked: boolean
  scrollY: number
  scrollbarWidth: number
}
