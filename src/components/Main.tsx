// import { useMemo } from 'react'
// import { Canvas } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
// import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'

// import { LevaMonitor } from './LevaMonitor'
// import { Game } from './Game'
// import Menu from './Menu'
// import { Wrapper } from './Wrapper'

// import { useMenuStore } from '../store/menuStore'
// import { cameraCONFIG } from '../config/cameraConfig'

// import '../styles/main.css'

// function Main() {
//   const { isVisible } = useMenuStore()
//   const { far, near, fov, aspect, zoom } = cameraCONFIG
//   const cameraSettings = useMemo(
//     () => ({
//       far,
//       near,
//       fov,
//       aspect,
//       zoom,
//     }),
//     [far, near, fov, aspect, zoom]
//   )

//   return (
//     <div className='main'>
//       <Wrapper>
//         <LevaMonitor />

//         <Canvas
//           dpr={[1, 2]}
//           shadows
//           gl={{
//             antialias: true,
//             toneMapping: ACESFilmicToneMapping,
//             outputColorSpace: SRGBColorSpace,
//           }}
//           camera={cameraSettings}
//         >
//           {/* <OrbitControls /> */}
//           <Game />
//         </Canvas>

//         {isVisible && <Menu />}
//       </Wrapper>
//     </div>
//   )
// }

// export default Main

import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { useMenuStore } from '../store/menuStore'
import { cameraCONFIG } from '../config/cameraConfig'
import '../styles/main.css'

const LevaMonitor = lazy(() =>
  import('./LevaMonitor').then((m) => ({ default: m.LevaMonitor })),
)
const Game = lazy(() => import('./Game').then((m) => ({ default: m.Game })))
const Menu = lazy(() => import('./Menu'))
const Wrapper = lazy(() => import('./Wrapper').then((m) => ({ default: m.Wrapper })))

// ✅ в Vite используем import.meta.env.DEV
const isDev = import.meta.env.DEV

// Держим сам компонент всегда lazy-определённым,
// а рендерим его только в dev — так проще для TS и JSX.
const OrbitControls = lazy(() =>
  import('@react-three/drei').then((m) => ({ default: m.OrbitControls })),
)

const GL_SETTINGS = {
  antialias: true,
  toneMapping: ACESFilmicToneMapping,
  outputColorSpace: SRGBColorSpace,
}

// ВАЖНО: кортеж [min,max], а не number[]
const DPR_SETTINGS: [number, number] = [1, 2]

const LoadingFallback = ({ text = 'Загрузка...' }) => (
  <div
    className='loading-fallback'
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: 18,
      color: '#666',
    }}
  >
    {text}
  </div>
)

const WebGLError = () => (
  <div
    className='webgl-error'
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: 20,
      textAlign: 'center',
      color: '#d32f2f',
    }}
  >
    <h3>WebGL не поддерживается</h3>
    <p>Обновите браузер или включите аппаратное ускорение.</p>
  </div>
)

const Scene = () => (
  <>
    {isDev && (
      <Suspense fallback={null}>
        {/* при необходимости раскомментируйте */}
        {/* <OrbitControls makeDefault /> */}
      </Suspense>
    )}
    <Suspense fallback={null}>
      <Game />
    </Suspense>
  </>
)

function Main() {
  const isVisible = useMenuStore((s) => s.isVisible)
  const { far, near, fov, zoom } = cameraCONFIG

  return (
    <div className='main'>
      <Suspense fallback={<LoadingFallback text='Инициализация приложения...' />}>
        <Wrapper>
          {isDev && (
            <Suspense fallback={null}>
              <LevaMonitor />
            </Suspense>
          )}

          <Canvas
            dpr={DPR_SETTINGS}
            // dpr={[1, 2] as const}
            shadows
            gl={GL_SETTINGS}
            camera={{ far, near, fov, zoom }}
            fallback={<WebGLError />}
            onCreated={({ gl }) => {
              gl.toneMappingExposure = 1.0
            }}
          >
            <Scene />
          </Canvas>

          {isVisible && (
            <Suspense fallback={<LoadingFallback text='Loading menu...' />}>
              <Menu />
            </Suspense>
          )}
        </Wrapper>
      </Suspense>
    </div>
  )
}

export default Main
