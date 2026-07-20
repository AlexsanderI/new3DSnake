import * as THREE from 'three'

export type ObstacleVisualState = {
  threeCoordX: THREE.Vector3[]
  threeCoordY: THREE.Vector3[]
  counter: number
  prevVisualX: number[]
  prevVisualY: number[]
  nextEngineX: number[]
  nextEngineY: number[]
}

export const obstacleVisualState: ObstacleVisualState = {
  threeCoordX: [],
  threeCoordY: [],
  counter: -1,
  prevVisualX: [],
  prevVisualY: [],
  nextEngineX: [],
  nextEngineY: [],
}

export function setObstacleVisualState(state: ObstacleVisualState): void {
  obstacleVisualState.threeCoordX = state.threeCoordX.map((coord) => coord.clone())
  obstacleVisualState.threeCoordY = state.threeCoordY.map((coord) => coord.clone())
  obstacleVisualState.counter = state.counter
  obstacleVisualState.prevVisualX = [...state.prevVisualX]
  obstacleVisualState.prevVisualY = [...state.prevVisualY]
  obstacleVisualState.nextEngineX = [...state.nextEngineX]
  obstacleVisualState.nextEngineY = [...state.nextEngineY]
}

export function resetObstacleVisualState(): void {
  obstacleVisualState.threeCoordX = []
  obstacleVisualState.threeCoordY = []
  obstacleVisualState.counter = -1
  obstacleVisualState.prevVisualX = []
  obstacleVisualState.prevVisualY = []
  obstacleVisualState.nextEngineX = []
  obstacleVisualState.nextEngineY = []
}

export function getObstacleVisualStateSnapshot(): Omit<
  ObstacleVisualState,
  'threeCoordX' | 'threeCoordY'
> & {
  threeCoordX: number[][]
  threeCoordY: number[][]
} {
  return {
    threeCoordX: obstacleVisualState.threeCoordX.map((coord) => [
      coord.x,
      coord.y,
      coord.z,
    ]),
    threeCoordY: obstacleVisualState.threeCoordY.map((coord) => [
      coord.x,
      coord.y,
      coord.z,
    ]),
    counter: obstacleVisualState.counter,
    prevVisualX: [...obstacleVisualState.prevVisualX],
    prevVisualY: [...obstacleVisualState.prevVisualY],
    nextEngineX: [...obstacleVisualState.nextEngineX],
    nextEngineY: [...obstacleVisualState.nextEngineY],
  }
}
