import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { Field } from './Field'
import { Environment } from './Environment'
import Snake from './Snake'
import Apple from './Apple'
import { useFrame, useThree } from '@react-three/fiber'
import { cameraCONFIG } from '../config/cameraConfig'
import { cameraLimitCONFIG } from '../config/cameraLimitConfig'
import { getSnakeUnitPosition } from '../animations/snakeAnimation/bodyAnimations/snakeBodyProps'
import { getSnakeBodyCoord } from '../engine/snake/snake'
import { getCurrentFoodNumber } from '../engine/food/currentFoodNumber'
import Obstacles from './Obstacles'
import Landscape from './Landscape'

let counter = 0
let currentFoodNumber = 0
let snakeLength = getSnakeBodyCoord().length

export function Scene() {
  // const { performance } = useControls('Monitoring', {
  //   performance: true,
  // })

  const { camera } = useThree()
  const [x, y, z] = cameraCONFIG.position
  const [xx, yy, zz] = cameraCONFIG.rotation
  camera.rotation.set(xx, yy, zz)

  // Вычисляем максимальное расстояние камеры на основе конфига
  const maxAdditionalDistance =
    cameraLimitCONFIG.MAX_ADDITIONAL_Z_DISTANCE !== null
      ? cameraLimitCONFIG.MAX_ADDITIONAL_Z_DISTANCE // Использовать абсолютное значение
      : z * cameraLimitCONFIG.MAX_ZOOM_OUT_PERCENT // Или процент от начального Z

  useFrame(() => {
    if (currentFoodNumber != getCurrentFoodNumber()) {
      counter = 1
      currentFoodNumber = getCurrentFoodNumber()
    }
    // Ограничиваем отдаление камеры максимальным значением
    const limitedSnakeLength = Math.min(snakeLength, maxAdditionalDistance)
    camera.position.set(
      x + getSnakeUnitPosition()[0][0],
      y + getSnakeUnitPosition()[0][1] - limitedSnakeLength,
      z + limitedSnakeLength,
    )
    camera.updateProjectionMatrix()
    if (counter >= 1 && counter < 60) {
      counter++
      snakeLength = snakeLength + 1 / 60
    } else {
      counter = 0
      snakeLength = getSnakeBodyCoord().length
    }
  })

  return (
    <>
      {/* performance && <Perf position='top-left' /> */}
      <Obstacles />
      <Snake />
      <Apple />
      <Field />
      <Landscape />
      <Environment />
    </>
  )
}
