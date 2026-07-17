import SnakeScull from './snakeScull/SnakeScull'
import SnakeEyes from './snakeEyes/SnakeEyes'
import SnakeJaw from './snakeJaw/SnakeJaw'
import SnakeTongue from './snakeTongue/snakeTongue'
import { getSnakeHeadProps } from '../../../animations/snakeAnimation/headAnimations/foodEatenAnimation'
function SnakeHead() {
  const headProps = { ...getSnakeHeadProps() }
  return (
    <group {...headProps}>
      <SnakeScull />
      <SnakeEyes />
      {/* <SnakeJaw /> */}
      <SnakeTongue />
    </group>
  )
}

export default SnakeHead
