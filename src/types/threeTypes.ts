import { Object3D, Vector3 } from 'three'

export interface GeometryProps {
  position: Vector3
  'rotation-x': number
  'rotation-y': number
  'rotation-z': number
  scale: number
}

export type GeometryTransitionProps = {
  position: number[]
  rotation: number[]
  scale: number
}

export interface CameraProps {
  fov: number
  near: number
  far: number
  aspect: number
  position: number[]
  rotation: number[]
  zoom: number
}

export type Position2D = [number, number]
export type Position3D = [number, number, number]

export interface GLTFResult {
  scene: Object3D
  nodes: { [name: string]: Object3D }
  materials: { [name: string]: any }
}
