import { Vector3 } from 'three'

export interface FieldConfig {
  /** Положение игрового поля */
  position?: Vector3 | [number, number, number]
  /** Цвет фона игрового поля */
  backgroundColor: string
}
