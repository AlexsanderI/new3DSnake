import { Vector3 } from '@react-three/fiber'

export interface AnimationStepProps {
  position: number[]
  rotation: number[]
  scale: number[]
}

export interface AnimationStep {
  name: string
  step: number
}

export interface AnimationProps extends AnimationStep, AnimationStepProps {}

export type SnakeSteps = {
  previousStepX: number
  previousStepY: number
  currentStepX: number
  currentStepY: number
}

export type SnakeDiffLocation = {
  diffX: number
  diffY: number
}

export type PreviousStep = {
  previousStepX: number
  previousStepY: number
}

export type MoveDirection = {
  turn: number // положение после поворота: 0-вверх, 11-вправо, 22-вниз, 33-влево
  turnItemNumber: number // порядковый номер элемента змейки(от головы), выполняющий поворот
}
