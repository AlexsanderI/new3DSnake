import * as React from 'react'
import { Object3D, Mesh } from 'three'

/**
 * Хук для настройки теней 3D-модели
 */
export const useShadowSetup = (scene: Object3D | undefined) => {
  React.useLayoutEffect(() => {
    if (!scene) return

    const setupShadows = (node: Object3D) => {
      if ((node as Mesh).isMesh) {
        const mesh = node as Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    }

    try {
      scene.traverse(setupShadows)
    } catch (error) {
      console.error('Ошибка настройки теней:', error)
    }
  }, [scene])
}
