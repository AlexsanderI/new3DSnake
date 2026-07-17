import { Sky } from '@react-three/drei'
import { AmbientLight } from './AmbientLight'
import { DirectionalLight } from './DirectionalLight'
import { lightCONFIG } from '../config/lightConfig'
export function Environment() {
  const { position, intensity } = lightCONFIG.sun
  return (
    <group>
      <Sky sunPosition={position} />
      <AmbientLight />
      <DirectionalLight intensity={intensity} />
    </group>
  )
}
