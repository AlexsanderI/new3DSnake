import { SnakeHeadCoord } from '../../types/snakeTypes'

export function getSnakeStepCells(snakeHead: SnakeHeadCoord): [number, number][] {
  const startX = snakeHead.snakeHeadCoordX - snakeHead.snakeHeadStepX
  const startY = snakeHead.snakeHeadCoordY - snakeHead.snakeHeadStepY
  const deltaX = snakeHead.snakeHeadCoordX - startX
  const deltaY = snakeHead.snakeHeadCoordY - startY
  const distance = Math.max(Math.abs(deltaX), Math.abs(deltaY))

  if (distance === 0) return [[snakeHead.snakeHeadCoordX, snakeHead.snakeHeadCoordY]]

  const stepX = deltaX === 0 ? 0 : deltaX / Math.abs(deltaX)
  const stepY = deltaY === 0 ? 0 : deltaY / Math.abs(deltaY)
  const traversedCells: [number, number][] = []

  for (let step = 1; step <= distance; step += 1) {
    traversedCells.push([startX + stepX * step, startY + stepY * step])
  }

  return traversedCells
}

export function didSnakeReachCellOnStep(
  snakeHead: SnakeHeadCoord,
  target: number[],
): boolean {
  return getSnakeStepCells(snakeHead).some(
    ([cellX, cellY]) => cellX === target[0] && cellY === target[1]
  )
}
