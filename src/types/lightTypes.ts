import { Vector3 } from '@react-three/fiber'
import { Position2D } from './threeTypes'

export type lightConfig = {
  sun: {
    position: Vector3
    intensity: number
  }
  ambientLight: {
    intensity: number
  }
  directionalLight: {
    shadowMapSize: Position2D
    castShadow: boolean
    shadowCameraNear: number
    shadowCameraFar: number
    shadowCameraLeft: number
    shadowCameraRight: number
    shadowCameraTop: number
    shadowCameraBottom: number
  }
}
