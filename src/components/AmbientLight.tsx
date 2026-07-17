import { lightCONFIG } from '../config/lightConfig'

export function AmbientLight() {
  const intensity = lightCONFIG.ambientLight.intensity
  return <ambientLight intensity={intensity} />
}
