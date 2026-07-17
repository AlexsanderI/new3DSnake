// import { Vector3 } from '@react-three/fiber'
// import { lightCONFIG } from '../config/lightConfig'

// /**
//  * Компонент направленного света (аналог солнца в 3D-сцене).
//  * @param intensity - яркость света
//  * @param position - положение источника света в 3D пространстве
//  */
// export function DirectionalLight({
//   intensity = 1,
//   position = [0, 10, 0],
// }: {
//   intensity?: number
//   position?: Vector3
// }) {
//   const lightConfig = lightCONFIG.directionalLight

//   return (
//     <directionalLight
//       position={position}
//       intensity={intensity}
//       castShadow={lightConfig.castShadow}
//       shadow-mapSize={lightConfig.shadowMapSize}
//       shadow-camera-near={lightConfig.shadowCameraNear}
//       shadow-camera-far={lightConfig.shadowCameraFar}
//       shadow-camera-left={lightConfig.shadowCameraLeft}
//       shadow-camera-right={lightConfig.shadowCameraRight}
//       shadow-camera-top={lightConfig.shadowCameraTop}
//       shadow-camera-bottom={lightConfig.shadowCameraBottom}
//     />
//   )
// }

import { useFrame } from '@react-three/fiber'
import { lightCONFIG } from '../config/lightConfig'
import { useRef } from 'react'
import * as THREE from 'three'
import { getSnakeUnitPosition } from '../animations/snakeAnimation/bodyAnimations/snakeBodyProps'

/**
 * Компонент направленного света, который следует за змейкой
 * Это решает проблему с пропаданием теней на краях большого поля
 */
export function DirectionalLight({ intensity = 1 }: { intensity?: number }) {
  const lightConfig = lightCONFIG.directionalLight
  const sunConfig = lightCONFIG.sun
  const lightRef = useRef<THREE.DirectionalLight>(null)

  const lightOffset = Array.isArray(sunConfig.position)
    ? sunConfig.position
    : sunConfig.position instanceof THREE.Vector3
      ? [sunConfig.position.x, sunConfig.position.y, sunConfig.position.z]
      : [sunConfig.position as number, 0, 0]

  const offsetX = lightOffset[0] // ✅ работает
  const offsetY = lightOffset[1]
  const offsetZ = lightOffset[2]

  // Обновляем позицию света каждый кадр, чтобы он следовал за змейкой
  useFrame(() => {
    if (lightRef.current) {
      const snakePos = getSnakeUnitPosition()[0]

      // Свет движется вместе со змейкой, сохраняя постоянное смещение
      lightRef.current.position.set(
        snakePos[0] + offsetX,
        snakePos[1] + offsetY,
        snakePos[2] + offsetZ,
      )

      // Теневая камера смотрит на позицию змейки (target)
      if (lightRef.current.target) {
        lightRef.current.target.position.set(snakePos[0], snakePos[1], snakePos[2])
        lightRef.current.target.updateMatrixWorld()
      }
    }
  })

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={sunConfig.position} // начальная позиция
        intensity={intensity}
        castShadow={lightConfig.castShadow}
        shadow-mapSize={lightConfig.shadowMapSize}
        shadow-camera-near={lightConfig.shadowCameraNear}
        shadow-camera-far={lightConfig.shadowCameraFar}
        shadow-camera-left={lightConfig.shadowCameraLeft}
        shadow-camera-right={lightConfig.shadowCameraRight}
        shadow-camera-top={lightConfig.shadowCameraTop}
        shadow-camera-bottom={lightConfig.shadowCameraBottom}
      />
    </>
  )
}
