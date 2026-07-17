import { lightConfig } from '../types/lightTypes'

export const lightCONFIG: lightConfig = {
  sun: {
    position: [-1, 5, 9], // положение источника света в 3-х мерном пространстве
    intensity: 1.5, // сила солнечного света
  },
  ambientLight: {
    intensity: 0.2,
  },
  directionalLight: {
    shadowMapSize: [1024, 1024], // размер текстуры теней: чем больше, тем чётче тени, но выше нагрузка.
    castShadow: true, // включает/выключивает тени
    // объём теневой камеры (ортографической), которая фиксирует, какие области сцены отбрасывают тень.
    shadowCameraNear: 0.1,
    shadowCameraFar: 20,
    shadowCameraLeft: -20,
    shadowCameraRight: 20,
    shadowCameraTop: 20,
    shadowCameraBottom: -20,
  },
}
