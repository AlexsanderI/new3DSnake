export type AssetPosition = [number, number, number]
export type AssetScale = [number, number, number]
export type AssetRotation = [number, number, number]

export type LandscapeItemType = 'rock' | 'tree' | 'bush'

export interface LandscapeObject {
  id: string
  type: LandscapeItemType
  position: AssetPosition
  rotation?: AssetRotation
  scale?: AssetScale
  seed?: number
}
