import { getTouch } from './touchEvent'
import { setNewMoveDirection } from './changeDirectionEvent'

let newSwipeMove = ''

export const swipeDirectionEvent = (): string => {
  const xDiff = getTouch()[1].x - getTouch()[0].x
  const yDiff = getTouch()[1].y - getTouch()[0].y
  if (Math.abs(Math.abs(xDiff) - Math.abs(yDiff)) > 1) {
    if (Math.abs(xDiff) < Math.abs(yDiff)) {
      if (yDiff > 0) {
        newSwipeMove = 'down'
        setNewMoveDirection('down')
        return 'ArrowDown'
      } else if (yDiff < 0) {
        newSwipeMove = 'up'
        setNewMoveDirection('up')
        return 'ArrowUp'
      }
    } else {
      if (xDiff > 0) {
        newSwipeMove = 'right'
        setNewMoveDirection('right')
        return 'ArrowRight'
      } else if (xDiff < 0) {
        newSwipeMove = 'left'
        setNewMoveDirection('left')
        return 'ArrowLeft'
      }
    }
  }

  return ''
}

export const getNewSwipeMove = () => newSwipeMove
