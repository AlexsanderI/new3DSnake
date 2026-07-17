import { GeometryProps } from '../../../types/threeTypes'
import SnakeBodyGeometry from './snakeBodyGeometry'
import { snakeCONFIG } from '../../../config/snakeConfig/snakeCONFIG'

type SnakeBodyPrismaProps = {
  zRotation: number
}

type SnakeBodyUnitProps = {
  right: number
  left: number
}

function SnakeBodyRightPrisma({ zRotation }: SnakeBodyPrismaProps) {
  const props: GeometryProps = { ...snakeCONFIG.body.left, 'rotation-z': zRotation }
  return (
    <mesh {...props} receiveShadow castShadow>
      <SnakeBodyGeometry />
      <meshStandardMaterial
        color={snakeCONFIG.colors.snakeFirstCOLOR}
        opacity={snakeCONFIG.opacity}
        transparent
      />
    </mesh>
  )
}

function SnakeBodyLeftPrisma({ zRotation }: SnakeBodyPrismaProps) {
  const props: GeometryProps = { ...snakeCONFIG.body.right, 'rotation-z': zRotation }
  return (
    <mesh {...props} receiveShadow castShadow>
      <SnakeBodyGeometry />
      <meshStandardMaterial
        color={snakeCONFIG.colors.snakeSecondCOLOR}
        opacity={snakeCONFIG.opacity}
        transparent
      />
    </mesh>
  )
}

function SnakeBodyUnit({ right, left }: SnakeBodyUnitProps) {
  return (
    <group>
      <SnakeBodyRightPrisma zRotation={right} />
      <SnakeBodyLeftPrisma zRotation={left} />
    </group>
  )
}

export default SnakeBodyUnit
