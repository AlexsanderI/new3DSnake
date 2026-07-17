import { snakeEYES } from './snakeEYES/snakeEYES'
import { snakeSCULL } from './snakeSCULL'
import { snakeJAW } from './snakeJAW'
import { snakeTONGUE } from './snakeTONGUE'
import { GeometryProps } from '../../../../types/threeTypes'
import { Vector3 } from 'three'

const SNAKE_HEAD_POSITION_X = 0
const SNAKE_HEAD_POSITION_Y = -0.06
const SNAKE_HEAD_POSITION_Z = 0
const SNAKE_HEAD_ROTATION_X = 0
const SNAKE_HEAD_ROTATION_Y = 0
const SNAKE_HEAD_ROTATION_Z = 0
const SNAKE_HEAD_SCALE = 0.9

export const snakeHEAD = {
  head: <GeometryProps>{
    position: new Vector3(
      SNAKE_HEAD_POSITION_X,
      SNAKE_HEAD_POSITION_Y,
      SNAKE_HEAD_POSITION_Z
    ),
    'rotation-x': SNAKE_HEAD_ROTATION_X,
    'rotation-y': SNAKE_HEAD_ROTATION_Y,
    'rotation-z': SNAKE_HEAD_ROTATION_Z,
    scale: SNAKE_HEAD_SCALE,
  },
  eyes: snakeEYES,
  scull: snakeSCULL,
  jaw: snakeJAW,
  tongue: snakeTONGUE,
}
